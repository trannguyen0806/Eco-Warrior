// PreloadScene — load tất cả asset 1 lần đầu, có loading bar.
// Các scene sau dùng asset từ cache, không phải load lại.

import { GAME, COLORS, TRASH_TYPES } from '../config.js';

export class PreloadScene extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    this._drawLoadingUi();

    this.load.image('block_map', 'assets/sprites/block_map.jpg');
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('trash_bin', 'assets/sprites/trash_bin.png');
    this.load.image('watering_can', 'assets/sprites/watering_can.png');
    this.load.image('watering_can_pouring', 'assets/sprites/watering_can_pouring.png');
    this.load.image('plant_stage_1', 'assets/sprites/plant_stage_1.png');
    this.load.image('plant_stage_2', 'assets/sprites/plant_stage_2.png');
    this.load.image('plant_stage_3', 'assets/sprites/plant_stage_3.png');
    TRASH_TYPES.forEach(k => this.load.image(k, `assets/sprites/${k}.png`));
    this.load.audio('bgm', 'assets/audio/florist.mp3');
  }

  create() {
    this.scene.start('Menu');
  }

  _drawLoadingUi() {
    const cx = GAME.WIDTH / 2, cy = GAME.HEIGHT / 2;
    this.add.text(cx, cy - 60, 'ECO-WARRIOR', {
      fontFamily: 'sans-serif', fontSize: '36px', color: COLORS.primary
    }).setOrigin(0.5);

    const barW = 360, barH = 22;
    this.add.rectangle(cx, cy, barW + 4, barH + 4, 0x222222)
      .setStrokeStyle(2, 0x8fd694);
    const bar = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0x8fd694)
      .setOrigin(0, 0.5);
    const pct = this.add.text(cx, cy + 36, '0%', {
      fontFamily: 'monospace', fontSize: '16px', color: COLORS.textMuted
    }).setOrigin(0.5);

    this.load.on('progress', p => {
      bar.width = barW * p;
      pct.setText(`${Math.round(p * 100)}%`);
    });
  }
}
