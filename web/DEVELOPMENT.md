# Eco-Warrior — Hướng dẫn phát triển

Tài liệu dành cho học sinh / giáo viên muốn **mở rộng** game (thêm level, thêm rác, thêm scene). Không cần biết Unity, chỉ cần trình soạn thảo (VS Code) + browser.

---

## 1. Tổng quan kiến trúc

```
src/
├── main.js                 Entry — khởi tạo Phaser, đăng ký 5 scene
├── config.js               TẤT CẢ "số" của game ở đây (level, tốc độ, điểm)
├── systems/
│   ├── sfx.js              Hiệu ứng âm thanh tạo bằng Web Audio API
│   └── save.js             Lưu trữ best score / unlocked level (localStorage)
├── entities/
│   ├── Player.js           Class nhân vật người chơi
│   └── Plant.js            Class cây với 3 stage
└── scenes/
    ├── PreloadScene.js     Load sprite/audio (1 lần, có progress bar)
    ├── MenuScene.js        Màn hình chính
    ├── HowToScene.js       Hướng dẫn chơi
    ├── GameScene.js        Gameplay (file lớn nhất)
    └── GameOverScene.js    Kết thúc — win/lose, save score
```

### Vòng đời 1 phiên chơi

```
PreloadScene  →  MenuScene  →  GameScene  →  GameOverScene
                     ↑              │              │
                     └──────────────┴──────────────┘
                          (nút Menu / ESC)
```

### Nguyên tắc đã áp dụng

- **Tách `config.js` riêng**: muốn balance lại game (tốc độ, điểm số, số rác) thì chỉ sửa đúng 1 file, không động vào logic.
- **Mỗi scene 1 file**: dễ tìm, dễ đọc, không có file 1000 dòng.
- **Entity tách class**: Player/Plant có method riêng (`water()`, `applyMudSlow()`) — gắn behavior vào object thay vì rải khắp scene.
- **Đặt tên tiếng Việt cho người chơi, tiếng Anh cho code**: text hiển thị `Bắt đầu`, biến code `startButton`.
- **Không có file `.min.js` trong source**: Phaser load từ CDN, asset nhẹ.

---

## 2. Cách chạy local

```bash
cd web
python -m http.server 8000
```

Mở `http://localhost:8000`. **Không** mở trực tiếp `index.html` bằng `file://` — browser sẽ chặn ES modules + asset (CORS).

### Cách khác (không cần Python)

- **VS Code**: cài extension *Live Server* → chuột phải `index.html` → Open with Live Server.
- **Node**: `npx serve` hoặc `npx http-server`.

---

## 3. Công thức mở rộng

### 3.1 Thêm level mới (dễ nhất)

Mở `src/config.js`, thêm 1 object vào mảng `LEVELS`:

```js
{
  id: 4,
  name: 'Sa mạc khô cằn',
  timeLimit: 50,        // giây
  plantCount: 5,        // số cây cần tưới
  trashCount: 15,       // số rác spawn
  randomSpawn: true,    // false = vị trí cố định (level 1)
  mudCount: 5,          // số vũng bùn (slow player)
},
```

Lưu file → refresh browser → level 4 xuất hiện trong menu. **Không cần sửa file nào khác.**

### 3.2 Thêm loại rác mới

1. Cho ảnh PNG vào `web/assets/sprites/<tên_mới>.png` (ví dụ `paper_box.png`).
2. Sửa `src/config.js`:
   ```js
   export const TRASH_TYPES = ['plastic_bottle', 'metal_can', 'garbage_can', 'paper_box'];

   export const TRASH_FACTS = {
     ...
     paper_box: '♻ Hộp giấy: 2–5 tháng phân huỷ',
   };
   ```
3. Xong. PreloadScene sẽ tự load sprite mới, GameScene tự random rác từ `TRASH_TYPES`.

### 3.3 Thêm scene mới (ví dụ màn hình Credits)

1. Tạo `src/scenes/CreditsScene.js`:
   ```js
   import { GAME, COLORS } from '../config.js';
   import { sfx } from '../systems/sfx.js';

   export class CreditsScene extends Phaser.Scene {
     constructor() { super('Credits'); }
     create() {
       this.add.text(GAME.WIDTH/2, 200, 'Made by ...', {
         fontFamily: 'sans-serif', fontSize: '24px', color: COLORS.text,
       }).setOrigin(0.5);
       this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
     }
   }
   ```
2. Đăng ký trong `src/main.js`:
   ```js
   import { CreditsScene } from './scenes/CreditsScene.js';
   // ...
   scene: [PreloadScene, MenuScene, HowToScene, GameScene, GameOverScene, CreditsScene],
   ```
3. Thêm nút mở scene trong `MenuScene.js` (gọi `this.scene.start('Credits')`).

### 3.4 Thêm hiệu ứng âm thanh mới

Trong `src/systems/sfx.js`, thêm 1 method:
```js
export const sfx = {
  ...
  jump() { sweep(200, 800, 0.15, 'square'); },
};
```
Dùng ở bất kỳ scene nào: `import { sfx } from '...'; sfx.jump();`

### 3.5 Đổi điều khiển

`GameScene._setupInput()` đăng ký phím. Muốn thêm phím R reset:

```js
this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
```

Trong `update()`:
```js
if (Phaser.Input.Keyboard.JustDown(this.rKey)) this.scene.restart();
```

---

## 4. Concept Phaser 3 cần biết

| Khái niệm | Ý nghĩa |
|---|---|
| **Scene** | 1 "màn hình" của game. Switch bằng `this.scene.start('TenScene')`. |
| **GameObject** | Mọi thứ hiện trên màn hình: Image, Text, Rectangle, Sprite. |
| **Physics body** | Cho phép GameObject va chạm. Có 2 loại: `dynamic` (di chuyển), `static` (đứng yên). |
| **Group** | Tập hợp GameObject cùng loại (ví dụ tất cả rác). |
| **Overlap** | Bắt sự kiện 2 object đè lên nhau, không đẩy nhau ra. Dùng cho pickup. |
| **Collide** | 2 object va chạm thật, đẩy nhau. |
| **Tween** | Animation cho thuộc tính (vd scale 1.0 → 1.3 trong 200ms). |
| **Input.Keyboard.JustDown** | True đúng 1 frame khi phím vừa nhấn (không liên tục). |

Doc gốc: https://phaser.io/docs

---

## 5. Roadmap đề xuất (nếu muốn phát triển tiếp)

**Dễ (1–2h mỗi cái):**
- [ ] Thêm sound BGM khác nhau theo level
- [ ] Thêm icon hiển thị loại rác đang cầm (HUD)
- [ ] Thêm animation walking 4 hướng cho player (cần sprite sheet)
- [ ] Thêm popup confirm khi ấn ESC trong Game

**Trung bình (4–8h):**
- [ ] Hỗ trợ touch mobile (joystick ảo + button)
- [ ] Settings scene: tắt nhạc, đổi độ phân giải
- [ ] Lưu replay (record input → playback)
- [ ] Boss "đám mây ô nhiễm" di chuyển, tránh được

**Khó (1+ tuần):**
- [ ] Map lớn hơn 960x540, camera follow player, tilemap
- [ ] Multiplayer 2 người 1 màn hình
- [ ] Map editor (kéo thả rác/cây)
- [ ] Build thành mobile app (Capacitor / Cordova)

---

## 6. Debug & troubleshooting

| Triệu chứng | Cách check |
|---|---|
| Màn trắng / đen | F12 → tab **Console** xem error đỏ |
| Sprite không hiện | Console → tab **Network** → check status code asset |
| Phím không phản hồi | Click vào canvas game trước (focus) |
| Nhạc không phát | Click chuột hoặc nhấn 1 phím (browser block autoplay) |
| Best score sai | F12 → tab **Application** → Local Storage → key `eco-warrior-save-v1` |
| Muốn reset toàn bộ save | Trong Console: `localStorage.removeItem('eco-warrior-save-v1')` |

---

## 7. Quy ước code

- File entity / class: **PascalCase.js** (`Player.js`, `Plant.js`).
- File util / system: **camelCase.js** (`sfx.js`, `save.js`).
- Method/biến private (chỉ dùng trong class): prefix `_` (`_setupInput`).
- Constant: **SCREAMING_SNAKE_CASE** (`PLAYER_SPEED`).
- Không dùng `var`, dùng `const`/`let`.
- Phaser API: dùng global `Phaser` (CDN), không cần import.

---

## 8. Câu hỏi thường gặp (FAQ)

**Q: Mình không có Python, mở thế nào?**
A: Cài Node (đã rất phổ biến), chạy `npx serve` trong folder `web/`. Hoặc dùng VS Code Live Server.

**Q: Asset nặng quá load lâu?**
A: Xem `web/assets/audio/florist.mp3` (~2.6MB). Đổi nhạc khác trong `PreloadScene.js` dòng `this.load.audio('bgm', ...)`.

**Q: Sao mỗi lần restart browser score reset?**
A: Browser ở chế độ Incognito/Private. localStorage không lưu chế độ này.

**Q: Có cần học toàn bộ Phaser không?**
A: Không. File `config.js` là thứ chỉnh nhiều nhất; chỉ cần đọc 1-2 scene là đủ để thêm tính năng.
