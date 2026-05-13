// Plant entity — 3 stage tăng trưởng. water() để lên stage tiếp.

export class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'plant_stage_1');
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setDisplaySize(60, 70);
    this.body.setSize(60, 70);
    this.body.updateFromGameObject();

    this.stage = 1;
    this.MAX_STAGE = 3;
  }

  /** Trả về true nếu lên stage thành công, false nếu đã max. */
  water() {
    if (this.stage >= this.MAX_STAGE) return false;
    this.stage++;
    this.setTexture(`plant_stage_${this.stage}`);
    this.setDisplaySize(60, 70);
    this.body.updateFromGameObject();

    // Pop effect
    this.scene.tweens.add({
      targets: this,
      scale: this.scale * 1.3,
      yoyo: true,
      duration: 150,
      ease: 'Back.easeOut',
    });
    return true;
  }

  isMaxStage() { return this.stage >= this.MAX_STAGE; }
}
