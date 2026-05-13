# Eco-Warrior — Web prototype

Game 2D bảo vệ môi trường: nhặt rác, bỏ vào thùng, tưới cây qua 3 giai đoạn trong vòng 90 giây.

## Stack
- **Phaser 3** (load từ CDN, không cần npm).
- HTML + CSS + JS thuần (1 file `game.js`).

## Chạy local
Mở terminal trong thư mục `web/`:

```bash
python -m http.server 8000
```

Mở browser `http://localhost:8000`.

> Vì sao cần server: browser chặn load file (sprite/audio) qua giao thức `file://` (CORS). Phải qua HTTP.

Nếu không có Python: cài extension **Live Server** trong VS Code → chuột phải `index.html` → Open with Live Server.

## Điều khiển
- **WASD / Mũi tên**: di chuyển.
- **Space**: tưới cây gần nhất (trong bán kính 90px).
- Đi đè lên rác = nhặt; đi đè lên thùng rác = bỏ rác → +điểm.
- **R** (sau khi kết thúc): chơi lại.

## Tính điểm
| Hành động | Điểm |
|---|---|
| Bỏ 1 rác vào thùng | +10 |
| Tưới cây 1 lần (1→2 hoặc 2→3) | +20 |

## Win / Lose
- **Win**: cả 3 cây đạt stage 3 trước khi hết giờ.
- **Lose**: hết 90 giây mà chưa xong.

## Cấu trúc
```
web/
├── index.html      Markup + CDN Phaser + link tới game.js
├── style.css       Style cơ bản (canvas centered)
├── game.js         Toàn bộ logic game (1 Phaser scene)
├── README.md       File này
└── assets/
    ├── sprites/    Copy từ Assets/Sprites/ + 1 sprite player
    └── audio/      florist.mp3
```

## Credits
- Nhạc nền `florist.mp3` — *Florist* by **TAD**, [CC0 từ OpenGameArt](https://opengameart.org/content/lofi-compilation). Không bắt buộc credit nhưng để cảm ơn tác giả.
- Sprite (cây, rác, bình tưới, player) tự vẽ / từ project Unity gốc.
