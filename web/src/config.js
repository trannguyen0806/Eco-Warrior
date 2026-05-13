// Cấu hình trung tâm — chỉnh số ở đây để thay đổi gameplay.
// Học sinh có thể đọc và sửa file này mà không cần biết Phaser.

export const GAME = {
  WIDTH: 960,
  HEIGHT: 540,
  PLAYER_SPEED: 220,
  WATER_RANGE: 90,       // bán kính px để tưới được cây
  INVENTORY_MAX: 5,      // số rác tối đa cầm trên tay
  COMBO_WINDOW_MS: 5000, // nhặt rác trong khoảng này tính combo
  COMBO_THRESHOLD: 3,    // nhặt đủ N rác liên tiếp → bonus
  COMBO_BONUS: 10,
  SCORE_PER_TRASH: 10,
  SCORE_PER_WATER: 20,
  MUD_SLOW_FACTOR: 0.5,  // player chậm 50% khi đi qua bùn
};

export const COLORS = {
  primary: '#8fd694',
  accent: '#ffd166',
  danger: '#ef476f',
  text: '#ffffff',
  textMuted: '#aaaaaa',
  bgDark: '#1a1a1a',
};

// Định nghĩa từng level. Thêm level mới = thêm 1 object vào mảng.
// Xem DEVELOPMENT.md mục "Thêm level mới".
export const LEVELS = [
  {
    id: 1,
    name: 'Khu vườn nhỏ',
    timeLimit: 90,
    plantCount: 2,
    trashCount: 5,
    randomSpawn: false,
    mudCount: 0,
  },
  {
    id: 2,
    name: 'Bãi cỏ rộng',
    timeLimit: 75,
    plantCount: 3,
    trashCount: 8,
    randomSpawn: true,
    mudCount: 0,
  },
  {
    id: 3,
    name: 'Vùng ô nhiễm',
    timeLimit: 60,
    plantCount: 4,
    trashCount: 12,
    randomSpawn: true,
    mudCount: 3,
  },
];

export const TRASH_TYPES = ['plastic_bottle', 'metal_can', 'garbage_can'];

// Popup giáo dục khi nhặt rác (random 1 fact theo loại)
export const TRASH_FACTS = {
  plastic_bottle: '♻ Chai nhựa cần 450 năm để phân huỷ!',
  metal_can: '♻ Lon kim loại: 80–100 năm phân huỷ',
  garbage_can: '♻ Phân loại rác giúp tái chế dễ hơn',
};

// Popup khi cây đạt stage 3
export const PLANT_GROWN_FACTS = [
  '🌳 1 cây hấp thụ ~22kg CO₂ mỗi năm!',
  '🌱 Cây xanh giảm bụi mịn PM2.5',
  '🍃 Khu có cây mát hơn 3–5°C',
];

// Vị trí spawn cố định cho Level 1 (dạy người chơi)
export const LEVEL1_LAYOUT = {
  player: { x: 480, y: 270 },
  bin: { x: 80, y: 100 },
  plants: [{ x: 700, y: 130 }, { x: 820, y: 380 }],
  trash: [
    { x: 260, y: 220, key: 'plastic_bottle' },
    { x: 380, y: 410, key: 'metal_can' },
    { x: 560, y: 470, key: 'garbage_can' },
    { x: 200, y: 320, key: 'plastic_bottle' },
    { x: 620, y: 200, key: 'metal_can' },
  ],
};
