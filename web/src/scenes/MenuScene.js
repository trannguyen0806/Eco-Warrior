// MenuScene — màn hình chính. 3 nút: Bắt đầu / Hướng dẫn / Best Score.
// Hiển thị best score tổng các level đã chơi.

import { GAME, COLORS, LEVELS } from '../config.js';
import { save } from '../systems/save.js';
import { sfx } from '../systems/sfx.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this.cameras.main.setBackgroundColor('#1f3a2e');

    // Title
    this.add.text(GAME.WIDTH / 2, 90, 'ECO-WARRIOR', {
      fontFamily: 'sans-serif', fontSize: '56px', color: COLORS.primary,
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 140, '— Người Hùng Môi Trường —', {
      fontFamily: 'sans-serif', fontSize: '20px', color: COLORS.textMuted,
    }).setOrigin(0.5);

    // Buttons
    this._makeButton(GAME.WIDTH / 2, 240, '▶  BẮT ĐẦU', () => this._goSelectLevel());
    this._makeButton(GAME.WIDTH / 2, 310, '📖  HƯỚNG DẪN', () => {
      sfx.click();
      this.scene.start('HowTo');
    });

    // Best score panel
    const unlocked = save.getUnlockedLevel();
    const lines = LEVELS.map(lv => {
      const best = save.getBestScore(lv.id);
      const locked = lv.id > unlocked ? '🔒' : '';
      return `Lv${lv.id} ${lv.name.padEnd(16, ' ')} ${locked || '🏆 ' + best}`;
    }).join('\n');

    this.add.text(GAME.WIDTH / 2, 430, lines, {
      fontFamily: 'monospace', fontSize: '16px', color: COLORS.text,
      align: 'left',
    }).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 20,
      'Có thể chọn level bằng số 1 / 2 / 3 sau khi bấm Bắt đầu', {
        fontFamily: 'sans-serif', fontSize: '12px', color: COLORS.textMuted,
      }).setOrigin(0.5);
  }

  _makeButton(x, y, label, onClick) {
    const w = 320, h = 50;
    const bg = this.add.rectangle(x, y, w, h, 0x2a5a45)
      .setStrokeStyle(2, 0x8fd694)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontFamily: 'sans-serif', fontSize: '22px', color: COLORS.text,
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setFillStyle(0x3a7d5c));
    bg.on('pointerout',  () => bg.setFillStyle(0x2a5a45));
    bg.on('pointerdown', onClick);
    return { bg, text };
  }

  _goSelectLevel() {
    sfx.click();
    // Bỏ qua màn chọn level riêng cho đơn giản: hỏi qua keyboard 1/2/3.
    // Hiện overlay chọn level.
    const overlay = this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2,
      GAME.WIDTH, GAME.HEIGHT, 0x000000, 0.85).setInteractive();
    const title = this.add.text(GAME.WIDTH / 2, 160, 'CHỌN LEVEL', {
      fontFamily: 'sans-serif', fontSize: '40px', color: COLORS.primary,
    }).setOrigin(0.5);

    const unlocked = save.getUnlockedLevel();
    const btns = LEVELS.map((lv, i) => {
      const y = 260 + i * 70;
      const locked = lv.id > unlocked;
      const label = locked
        ? `🔒  Lv${lv.id} — ${lv.name}`
        : `Lv${lv.id} — ${lv.name}  (${lv.timeLimit}s, ${lv.plantCount} cây, ${lv.trashCount} rác)`;
      const color = locked ? 0x444444 : 0x2a5a45;
      const rect = this.add.rectangle(GAME.WIDTH / 2, y, 540, 50, color)
        .setStrokeStyle(2, locked ? 0x666666 : 0x8fd694);
      const txt = this.add.text(GAME.WIDTH / 2, y, label, {
        fontFamily: 'sans-serif', fontSize: '20px',
        color: locked ? '#888' : '#fff',
      }).setOrigin(0.5);

      if (!locked) {
        rect.setInteractive({ useHandCursor: true });
        rect.on('pointerover', () => rect.setFillStyle(0x3a7d5c));
        rect.on('pointerout',  () => rect.setFillStyle(0x2a5a45));
        rect.on('pointerdown', () => {
          sfx.click();
          this.scene.start('Game', { levelId: lv.id });
        });
      }
      return rect;
    });

    // ESC để đóng overlay
    this.input.keyboard.once('keydown-ESC', () => {
      overlay.destroy(); title.destroy(); btns.forEach(b => b.destroy());
      this.scene.restart();
    });
  }
}
