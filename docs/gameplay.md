# Eco-Warrior — Gameplay

## Tóm tắt
Eco-Warrior là một game 2D nhỏ chủ đề **bảo vệ môi trường**. Người chơi điều khiển một nhân vật đi quanh bản đồ, **nhặt rác** (chai nhựa, lon sắt, lon rác) bỏ vào thùng rác, và **dùng bình tưới cây** để chăm cây trồng phát triển qua 3 giai đoạn.

> Trạng thái hiện tại: bản demo rất sớm. Mới có nhân vật di chuyển + bản đồ block + nhạc nền. Logic nhặt rác, tưới cây, sinh trưởng cây chưa được lập trình — chỉ có asset (sprite) sẵn sàng.

## Vòng chơi dự kiến (suy ra từ asset)
1. Người chơi spawn trên map (xếp bằng các `block_map.jpg`).
2. Đi quanh map, nhặt các vật phẩm rác:
   - `plastic_bottle.png` — chai nhựa
   - `metal_can.png` — lon kim loại
   - `garbage_can.png` — lon rác khác
3. Bỏ rác vào `trash_bin.png` (thùng rác).
4. Cầm `watering_can.png`; khi tưới đổi thành `watering_can_pouring.png` (sprite có nước chảy ra).
5. Tưới các cây để chúng lớn lên qua 3 giai đoạn:
   - `plant_stage_1.png` → `plant_stage_2.png` → `plant_stage_3.png`

## Điều khiển hiện tại
- Di chuyển: phím **WASD** / **mũi tên** (trục `Horizontal` và `Vertical` của Unity Input Manager).
- Tốc độ mặc định: `moveSpeed = 5f` (chỉnh trong Inspector của `player`).

## Asset âm thanh
- Nhạc nền: `Assets/music_summer_harvest.mp3` (*Grow A Garden — Summer Harvest OST (1h Loop)*). Sẽ được gắn vào AudioSource `Audio Manager/music`.
- `Audio Manager/Sfx`: AudioSource riêng cho hiệu ứng âm thanh — chưa có clip nào được gán.

> ⚠ Hiện tại 2 AudioSource trong scene **chưa được kéo clip nhạc vào** (`m_audioClip: {fileID: 0}`). Cần vào Inspector → kéo `music_summer_harvest.mp3` vào field AudioClip của `music` GameObject để có nhạc khi Play.

## Những phần chưa làm
- Chưa có script cho: bình tưới cây, nhặt rác, vòng đời cây, điểm số / HUD, end-game.
- `AudioManager.cs` đã có API (PlayMusic/PlaySfx) nhưng chưa được Add Component vào `Audio Manager` GameObject.
- Player chưa có sprite renderer động (animations) — đang dùng một sprite tĩnh trong scene.
