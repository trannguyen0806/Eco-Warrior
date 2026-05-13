# Eco-Warrior — Gameplay

## Tóm tắt
Eco-Warrior là một game 2D nhỏ chủ đề **bảo vệ môi trường**. Người chơi điều khiển một nhân vật đi quanh bản đồ, **nhặt rác** (chai nhựa, lon sắt, lon rác) bỏ vào thùng rác, và **dùng bình tưới cây** để chăm cây trồng phát triển qua 3 giai đoạn.

> Trạng thái hiện tại: bản demo rất sớm. Mới có nhân vật di chuyển + bản đồ block + nhạc nền. Logic nhặt rác, tưới cây, sinh trưởng cây chưa được lập trình — chỉ có asset (sprite) sẵn sàng.

## Vòng chơi dự kiến (suy ra từ asset)
1. Người chơi spawn trên map (xếp bằng các block map).
2. Đi quanh map, nhặt các vật phẩm rác:
   - `chai nhựa.png` — chai nhựa
   - `lon sắt.png` — lon kim loại
   - `lon rác.png` — lon rác khác
3. Bỏ rác vào `hộp rác.png` (thùng rác).
4. Cầm `bình tưới cây.png`; khi tưới đổi thành `bình tưới cây chảy nước.png` (sprite có nước chảy ra).
5. Tưới các cây để chúng lớn lên qua 3 giai đoạn:
   - `cây giai đoạn 1.png` → `cây giai đoạn 2.png` → `giai đoạn 3.png`

## Điều khiển hiện tại
- Di chuyển: phím **WASD** / **mũi tên** (trục `Horizontal` và `Vertical` của Unity Input Manager).
- Tốc độ mặc định: `moveSpeed = 5f` (chỉnh trong Inspector của `player`).

## Asset âm thanh
- Nhạc nền: *Grow A Garden — Summer Harvest OST (1h Loop)*. Được gắn vào GameObject `Audio Manager/music` (AudioSource, PlayOnAwake = 1).
- `Audio Manager/Sfx`: AudioSource riêng cho hiệu ứng âm thanh — chưa có clip nào được gán.

## Những phần chưa làm
- Chưa có script cho: bình tưới cây, nhặt rác, vòng đời cây, điểm số / HUD, end-game.
- `AudioManager.cs` mới chỉ là file rỗng (class `NewEmptyCSharpScript1`), chưa quản lý nhạc/SFX.
- Player chưa có sprite renderer động (animations) — đang dùng một sprite tĩnh trong scene.
