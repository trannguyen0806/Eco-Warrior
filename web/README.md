# Eco-Warrior — Web Game

Game 2D giáo dục về bảo vệ môi trường. Nhặt rác → bỏ thùng → tưới cây 3 giai đoạn, có Menu, 3 level tăng dần độ khó, best score, hiệu ứng âm thanh, kiến thức môi trường lồng ghép.

**Mục tiêu:** demo cho học sinh cấp 2, code đơn giản dễ học và mở rộng.

## Chạy local

```bash
cd web
python -m http.server 8000
```

Mở `http://localhost:8000`.

> Cần server (không mở file:// trực tiếp được). Không cài Python thì dùng `npx serve`, hoặc extension **Live Server** trong VS Code.

## Cách chơi

| Phím | Hành động |
|---|---|
| **WASD** / **Mũi tên** | Di chuyển |
| **Space** | Tưới cây gần nhất (trong bán kính 90px) |
| **ESC** | Về Menu (đang chơi) |

- Đi đè rác = nhặt (tối đa 5 rác cùng lúc).
- Đi đè thùng rác = bỏ → **+10đ / rác**.
- Tưới cây = lên giai đoạn (1→2→3) → **+20đ / lần**.
- Nhặt 3 rác liên tiếp trong 5 giây = **Combo +10đ bonus**.
- Level 3 có vũng bùn — đi qua bị chậm 50%.

## Level

| Level | Thời gian | Cây | Rác | Đặc biệt |
|---|---|---|---|---|
| **1 — Khu vườn nhỏ** | 90s | 2 | 5 | Spawn cố định, tutorial |
| **2 — Bãi cỏ rộng** | 75s | 3 | 8 | Spawn random |
| **3 — Vùng ô nhiễm** | 60s | 4 | 12 | Random + 3 vũng bùn |

Level tiếp theo mở khi hoàn thành level trước.

## Tech stack

- **Phaser 3** (CDN, không build tool)
- **ES Modules** native (browser hiện đại)
- **localStorage** lưu best score + unlocked level
- **Web Audio API** tạo SFX bằng code (không cần file âm thanh)

## Cấu trúc

```
web/
├── index.html
├── style.css
├── README.md            ← file này
├── DEVELOPMENT.md       ← hướng dẫn phát triển (xem để mở rộng)
├── src/
│   ├── main.js          Entry + Phaser config
│   ├── config.js        ⭐ Cấu hình level / điểm — chỉnh ở đây
│   ├── systems/         sfx.js, save.js
│   ├── entities/        Player.js, Plant.js
│   └── scenes/          PreloadScene, MenuScene, HowToScene, GameScene, GameOverScene
└── assets/
    ├── sprites/         11 PNG (player, plants, trash, bin, ...)
    └── audio/           florist.mp3 (2.6MB, CC0)
```

Xem **[DEVELOPMENT.md](./DEVELOPMENT.md)** để biết:
- Thêm level mới (sửa 1 file)
- Thêm loại rác mới
- Thêm scene mới
- Concept Phaser cần biết
- Debug & troubleshooting

## Credits

- Nhạc nền *Florist* by **TAD** — [CC0 OpenGameArt](https://opengameart.org/content/lofi-compilation).
- Sprite từ project Unity gốc (tự vẽ).
