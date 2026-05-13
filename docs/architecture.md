# Eco-Warrior — Kiến trúc hệ thống

## Stack
- **Engine**: Unity **6000.4.6f1** (Unity 6).
- **Render**: Universal Render Pipeline (URP) — `com.unity.render-pipelines.universal@17.4.0`.
- **2D**: bộ package 2D đầy đủ (Sprite, Tilemap, SpriteShape, Animation, Aseprite/PSD importer).
- **Input**: cả `Input Manager` cũ (đang dùng) + `com.unity.inputsystem@1.19.0` (đã cài, chưa dùng).
- **Ngôn ngữ**: C# (.NET / Mono trong Unity).

## Cấu trúc thư mục
```
Eco-Warrior/
├── .gitignore                  # ignore Library/, Temp/, .csproj/.slnx, ...
├── Packages/manifest.json      # Khai báo package Unity
├── ProjectSettings/            # Thiết lập project, version Unity
├── Assets/
│   ├── Scenes/SampleScene.unity        # Scene duy nhất
│   ├── Settings/                       # URP / scene template / global settings
│   ├── player/                         # Sprite nhân vật (7 PNG)
│   ├── Scripts/                        # Script C#
│   │   └── AudioManager.cs             # Singleton quản lý music + SFX
│   ├── player.cs                       # Player movement — class `player : MonoBehaviour`
│   ├── Sprites/                        # Sprite vật phẩm (rác, bình tưới, cây, map)
│   │   ├── block_map.jpg
│   │   ├── plastic_bottle.png / metal_can.png / garbage_can.png
│   │   ├── trash_bin.png
│   │   ├── watering_can.png / watering_can_pouring.png
│   │   └── plant_stage_1.png / plant_stage_2.png / plant_stage_3.png
│   ├── music_summer_harvest.mp3        # Nhạc nền (Summer Harvest OST)
│   └── _Recovery/                      # Backup Unity tự sinh
└── docs/                               # tài liệu
```

> File player MonoBehaviour duy nhất giờ là `Assets/player.cs` — gắn vào GameObject `player` trong scene.

## Sơ đồ scene `SampleScene`
```
SampleScene
├── Main Camera                    (Camera + URPCameraData)
├── Global Light 2D                (Light2D URP, ambient)
├── Map
│   ├── block map_0
│   ├── block map_0 (1)
│   ├── block map_0 (2)
│   └── image-removebg-preview (6)_0     (sprite trang trí / cây?)
├── player                         (CircleCollider2D + Rigidbody2D[gravityScale=0] + SpriteRenderer + MonoBehaviour `player.cs`)
└── Audio Manager
    ├── music                      (AudioSource, PlayOnAwake)
    └── Sfx                        (AudioSource, chưa có clip)
```

- `player` dùng **Rigidbody2D `gravityScale = 0`** → game top-down (không có trọng lực rơi).
- `CircleCollider2D` bán kính `~0.32`, offset `(-0.58, -0.10)` → bám vào chân nhân vật.

## Script
| File | Class | Vai trò |
|---|---|---|
| `Assets/player.cs` | `player : MonoBehaviour` | Di chuyển nhân vật bằng `Rigidbody2D.linearVelocity` |
| `Assets/Scripts/AudioManager.cs` | `AudioManager : MonoBehaviour` | Singleton quản lý music + SFX (PlaySfx / PlayMusic / StopMusic) |

### `player.cs` logic
- `Awake()` lấy `Rigidbody2D` qua `GetComponent`.
- `Update()` đọc input `Horizontal` / `Vertical` vào `moveInput` (Vector2).
- `FixedUpdate()` gán `rb.linearVelocity = moveInput * moveSpeed` → di chuyển qua vật lý 2D (Unity 6 API).
- `[RequireComponent(typeof(Rigidbody2D))]` đảm bảo GameObject luôn có Rigidbody2D.

### `AudioManager.cs` logic
- Singleton `AudioManager.Instance` (Awake bảo vệ trùng lặp).
- Tham chiếu 2 `AudioSource` (gán trong Inspector): `musicSource` (cho `music` GameObject) và `sfxSource` (cho `Sfx` GameObject).
- API: `PlaySfx(clip)`, `PlayMusic(clip, loop)`, `StopMusic()`.

## Issues đã sửa
1. ✅ **`Assets/player.cs`** — sửa typo `transfrom` → `transform`, viết lại theo Rigidbody2D + FixedUpdate.
2. ✅ **`Assets/Scripts/AudioManager.cs`** — class đã đổi thành `AudioManager : MonoBehaviour`, có API cơ bản.
3. ✅ **Xoá stub** `Assets/scrip/player.cs` và `Assets/scrip/NewEmptyCSharpScript.cs` (cùng `.meta`).
4. ✅ **GUID** trong `Assets/player.cs.meta` đã re-point về đúng giá trị scene yêu cầu (`f8ed0b11...`).
5. ✅ **Rename tiếng Việt → English**: `Assets/tài nguyên/` → `Assets/Sprites/`, `Assets/scrip/` → `Assets/Scripts/`, các sprite/audio đều đổi tên ASCII (xem cấu trúc thư mục ở trên).
6. ✅ **.gitignore** chuẩn Unity, untrack `Library/`, `Logs/`, `UserSettings/`, csproj, slnx.

> Sau khi sửa, mở Unity 6000.4.6f1 → Play sẽ chạy được (nhân vật di chuyển theo phím Horizontal/Vertical).

## Quy trình chạy
1. Cài Unity Hub + Unity Editor **6000.4.6f1** (URP).
2. Mở Unity Hub → Add → trỏ vào thư mục `Eco-Warrior`.
3. Mở scene `Assets/Scenes/SampleScene.unity`.
4. Trong Inspector của `Audio Manager`, kéo `music` (AudioSource) vào field `Music Source` và `Sfx` (AudioSource) vào field `Sfx Source` (chỉ khi gắn script `AudioManager.cs` vào GameObject `Audio Manager`).
5. Bấm Play — nhân vật `player` di chuyển bằng phím mũi tên / WASD.
