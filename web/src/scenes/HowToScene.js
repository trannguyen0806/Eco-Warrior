// HowToScene — 1 trang hướng dẫn chơi. Nút Back về Menu.

import { GAME, COLORS } from '../config.js';
import { sfx } from '../systems/sfx.js';

export class HowToScene extends Phaser.Scene {
  constructor() { super('HowTo'); }

  create() {
    this.cameras.main.setBackgroundColor('#1f3a2e');

    this.add.text(GAME.WIDTH / 2, 50, 'HƯỚNG DẪN CHƠI', {
      fontFamily: 'sans-serif', fontSize: '36px', color: COLORS.primary,
    }).setOrigin(0.5);

    const lines = [
      '🎮  Di chuyển:    WASD  hoặc  Mũi tên',
      '🌿  Tưới cây:     Đến gần cây + nhấn  SPACE',
      '',
      '🗑️  Nhặt rác:     Đi đè lên vật phẩm (tự nhặt)',
      '♻️  Bỏ rác:        Đi đè lên thùng rác (tự bỏ)',
      '',
      '⏱️  Hết giờ là thua. Đưa cả 3 cây lên giai đoạn 3 để thắng.',
      '⚡  Nhặt liên tiếp 3 rác trong 5s = COMBO  +10đ bonus',
      '🪣  Cầm tối đa 5 rác — phải xả thùng trước khi nhặt thêm',
      '',
      '💯  Điểm:  +10 / rác bỏ thùng    +20 / lần tưới cây',
      '🏆  Level mới mở khi hoàn thành level trước',
    ];
    this.add.text(GAME.WIDTH / 2, 240, lines.join('\n'), {
      fontFamily: 'sans-serif', fontSize: '18px', color: COLORS.text,
      align: 'left', lineSpacing: 8,
    }).setOrigin(0.5);

    // Back button
    const btn = this.add.rectangle(GAME.WIDTH / 2, 490, 240, 44, 0x2a5a45)
      .setStrokeStyle(2, 0x8fd694)
      .setInteractive({ useHandCursor: true });
    this.add.text(GAME.WIDTH / 2, 490, '← QUAY LẠI MENU', {
      fontFamily: 'sans-serif', fontSize: '20px', color: COLORS.text,
    }).setOrigin(0.5);
    btn.on('pointerover', () => btn.setFillStyle(0x3a7d5c));
    btn.on('pointerout',  () => btn.setFillStyle(0x2a5a45));
    btn.on('pointerdown', () => { sfx.click(); this.scene.start('Menu'); });

    this.input.keyboard.once('keydown-ESC', () => this.scene.start('Menu'));
  }
}
