// SFX bằng Web Audio API — tạo tone bằng code, không cần file âm thanh.
// Mỗi hàm là 1 hiệu ứng âm thanh ngắn. Thêm SFX mới: viết hàm mới ở đây.

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Browser block AudioContext trước user gesture — resume sau gesture đầu
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration, type = 'sine', volume = 0.15) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function sweep(freqStart, freqEnd, duration, type = 'sine', volume = 0.15) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(freqEnd, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const sfx = {
  pickup() { tone(880, 0.08, 'square'); },
  drop() { tone(440, 0.12, 'sine'); setTimeout(() => tone(660, 0.12, 'sine'), 80); },
  water() { sweep(300, 600, 0.25, 'sine'); },
  combo() { tone(1320, 0.1, 'triangle'); setTimeout(() => tone(1760, 0.15, 'triangle'), 80); },
  win() {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => tone(f, 0.2, 'triangle', 0.2), i * 150));
  },
  lose() { sweep(440, 110, 0.6, 'sawtooth', 0.2); },
  click() { tone(660, 0.05, 'square', 0.1); },
};
