// Player entity — extend Phaser physics image để có method riêng.
// Trách nhiệm: di chuyển, lật mặt, slow khi đi qua bùn.

import { GAME } from '../config.js';

export class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(64, 64).setCollideWorldBounds(true);
    this.body.setCircle(this.width / 2);

    this.speedMultiplier = 1;       // dùng để slow khi đi qua bùn
    this._idleTween = scene.tweens.add({
      targets: this, scaleX: this.scaleX * 1.05, scaleY: this.scaleY * 1.05,
      yoyo: true, repeat: -1, duration: 350, paused: true,
    });
  }

  /** vx, vy là -1 / 0 / 1. Hàm tự chuẩn hoá chéo + nhân speed. */
  setMoveInput(vx, vy) {
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2; vy *= Math.SQRT1_2;
    }
    const speed = GAME.PLAYER_SPEED * this.speedMultiplier;
    this.body.setVelocity(vx * speed, vy * speed);

    const moving = vx !== 0 || vy !== 0;
    if (moving && this._idleTween.paused) this._idleTween.resume();
    if (!moving && !this._idleTween.paused) {
      this._idleTween.pause();
      this.setScale(1, 1).setDisplaySize(64, 64);
    }

    if (vx < 0) this.setFlipX(true);
    else if (vx > 0) this.setFlipX(false);
  }

  /** Bị slow khi standing trên mud zone. Reset mỗi frame. */
  applyMudSlow(slowFactor) { this.speedMultiplier = slowFactor; }
  resetSpeed() { this.speedMultiplier = 1; }
}
