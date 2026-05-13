// GameOverScene — hiển thị kết quả. Save best score + unlock level tiếp.

import { GAME, COLORS, LEVELS } from '../config.js';
import { save } from '../systems/save.js';
import { sfx } from '../systems/sfx.js';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.won = !!data.won;
    this.score = data.score | 0;
    this.levelId = data.levelId | 0;
  }

  create() {
    this.cameras.main.setBackgroundColor(this.won ? '#1a4d33' : '#4d1a1a');

    let isNewRecord = false;
    if (this.won) {
      save.unlockLevel(this.levelId + 1);
      isNewRecord = save.setBestScore(this.levelId, this.score);
    }

    // Title
    this.add.text(GAME.WIDTH / 2, 90,
      this.won ? '🎉  HOÀN THÀNH!' : '⏰  HẾT GIỜ',
      { fontFamily: 'sans-serif', fontSize: '52px',
        color: this.won ? COLORS.primary : COLORS.danger,
        stroke: '#000', strokeThickness: 4 }
    ).setOrigin(0.5);

    // Score
    this.add.text(GAME.WIDTH / 2, 180,
      `Điểm: ${this.score}`,
      { fontFamily: 'sans-serif', fontSize: '32px', color: COLORS.text }
    ).setOrigin(0.5);

    if (isNewRecord) {
      this.add.text(GAME.WIDTH / 2, 220, '🏆 KỶ LỤC MỚI!', {
        fontFamily: 'sans-serif', fontSize: '20px', color: COLORS.accent,
      }).setOrigin(0.5);
    } else if (this.won) {
      const best = save.getBestScore(this.levelId);
      this.add.text(GAME.WIDTH / 2, 220, `Best: ${best}`, {
        fontFamily: 'sans-serif', fontSize: '18px', color: COLORS.textMuted,
      }).setOrigin(0.5);
    }

    // Buttons
    const baseY = 320;
    this._makeButton(GAME.WIDTH / 2, baseY,
      this.won ? '🔁  CHƠI LẠI LEVEL' : '🔁  THỬ LẠI',
      () => { sfx.click(); this.scene.start('Game', { levelId: this.levelId }); });

    const nextLevel = LEVELS.find(l => l.id === this.levelId + 1);
    if (this.won && nextLevel) {
      this._makeButton(GAME.WIDTH / 2, baseY + 70,
        `▶  LEVEL TIẾP — ${nextLevel.name}`,
        () => { sfx.click(); this.scene.start('Game', { levelId: nextLevel.id }); });
    }

    this._makeButton(GAME.WIDTH / 2, baseY + 140, '🏠  VỀ MENU',
      () => { sfx.click(); this.scene.start('Menu'); });
  }

  _makeButton(x, y, label, onClick) {
    const w = 380, h = 50;
    const bg = this.add.rectangle(x, y, w, h, 0x2a5a45)
      .setStrokeStyle(2, 0x8fd694)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontFamily: 'sans-serif', fontSize: '20px', color: COLORS.text,
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x3a7d5c));
    bg.on('pointerout',  () => bg.setFillStyle(0x2a5a45));
    bg.on('pointerdown', onClick);
  }
}
