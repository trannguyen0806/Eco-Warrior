// Lưu trữ vĩnh viễn (localStorage). Lưu: best score mỗi level, level đã unlock.
// Học sinh có thể mở DevTools → Application → Local Storage để xem.

const KEY = 'eco-warrior-save-v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    return { ...defaultData(), ...JSON.parse(raw) };
  } catch {
    return defaultData();
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function defaultData() {
  return {
    unlockedLevel: 1,        // Bắt đầu chỉ có level 1
    bestScores: {},          // { "1": 150, "2": 220, ... }
  };
}

export const save = {
  getUnlockedLevel() { return read().unlockedLevel; },

  unlockLevel(level) {
    const data = read();
    if (level > data.unlockedLevel) {
      data.unlockedLevel = level;
      write(data);
    }
  },

  getBestScore(levelId) {
    return read().bestScores[String(levelId)] || 0;
  },

  setBestScore(levelId, score) {
    const data = read();
    const key = String(levelId);
    if (!data.bestScores[key] || score > data.bestScores[key]) {
      data.bestScores[key] = score;
      write(data);
      return true; // new record
    }
    return false;
  },

  reset() { localStorage.removeItem(KEY); },
};
