// Eco-Warrior — prototype MVP
// Phaser 3 single-scene game: nhặt rác, bỏ thùng, tưới cây 3 stage, 90s countdown.

const GAME_W = 960;
const GAME_H = 540;
const TIME_LIMIT = 90;
const PLAYER_SPEED = 220;
const WATER_RANGE = 90;

const TRASH_KEYS = ['plastic_bottle', 'metal_can', 'garbage_can'];

class MainScene extends Phaser.Scene {
  constructor() {
    super('Main');
  }

  preload() {
    this.load.image('block_map', 'assets/sprites/block_map.jpg');
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('trash_bin', 'assets/sprites/trash_bin.png');
    this.load.image('watering_can', 'assets/sprites/watering_can.png');
    this.load.image('watering_can_pouring', 'assets/sprites/watering_can_pouring.png');
    this.load.image('plant_stage_1', 'assets/sprites/plant_stage_1.png');
    this.load.image('plant_stage_2', 'assets/sprites/plant_stage_2.png');
    this.load.image('plant_stage_3', 'assets/sprites/plant_stage_3.png');
    TRASH_KEYS.forEach(k => this.load.image(k, `assets/sprites/${k}.png`));
    this.load.audio('bgm', 'assets/audio/florist.mp3');

    // Loading UI
    const cx = this.cameras.default.width / 2;
    const cy = this.cameras.default.height / 2;
    const barW = 360, barH = 22;
    const bg = this.add.rectangle(cx, cy, barW + 4, barH + 4, 0x222222).setStrokeStyle(2, 0x8fd694);
    const bar = this.add.rectangle(cx - barW / 2, cy, 0, barH, 0x8fd694).setOrigin(0, 0.5);
    const label = this.add.text(cx, cy - 36, 'Đang tải...', {
      fontFamily: 'sans-serif', fontSize: '22px', color: '#fff'
    }).setOrigin(0.5);
    const pct = this.add.text(cx, cy + 36, '0%', {
      fontFamily: 'monospace', fontSize: '16px', color: '#aaa'
    }).setOrigin(0.5);
    this.load.on('progress', p => {
      bar.width = barW * p;
      pct.setText(`${Math.round(p * 100)}%`);
    });
    this.load.on('complete', () => { bg.destroy(); bar.destroy(); label.destroy(); pct.destroy(); });
  }

  create() {
    this.score = 0;
    this.inventory = 0;
    this.timeLeft = TIME_LIMIT;
    this.gameEnded = false;

    // Background: tile block_map to fill canvas
    this.add.tileSprite(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 'block_map')
      .setTileScale(0.4, 0.4);

    // Trash bin
    this.bin = this.physics.add.staticImage(80, 100, 'trash_bin')
      .setDisplaySize(60, 80).refreshBody();

    // Plants (each needs to track its own stage)
    this.plants = [
      this.makePlant(700, 130),
      this.makePlant(820, 380),
      this.makePlant(180, 450)
    ];

    // Trash items at fixed positions
    this.trashGroup = this.physics.add.group();
    const trashSpawn = [
      [260, 220, 'plastic_bottle'],
      [380, 410, 'metal_can'],
      [560, 470, 'garbage_can'],
      [200, 320, 'plastic_bottle'],
      [620, 200, 'metal_can'],
      [450, 130, 'garbage_can']
    ];
    trashSpawn.forEach(([x, y, key]) => {
      const t = this.trashGroup.create(x, y, key).setDisplaySize(42, 42);
      t.body.setCircle(t.displayWidth / 2);
      t.body.setOffset(0, 0);
    });

    // Player
    this.player = this.physics.add.image(GAME_W / 2, GAME_H / 2, 'player')
      .setDisplaySize(64, 64)
      .setCollideWorldBounds(true);
    this.player.body.setCircle(this.player.width / 2);

    // Watering can icon shown next to player when pressing space
    this.canIcon = this.add.image(0, 0, 'watering_can')
      .setDisplaySize(36, 28)
      .setVisible(false);

    // Collisions / overlaps
    this.physics.add.overlap(this.player, this.trashGroup, this.pickup, null, this);
    this.physics.add.overlap(this.player, this.bin, this.dropAtBin, null, this);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // HUD
    const hudStyle = { fontFamily: 'monospace', fontSize: '20px', color: '#fff',
                       stroke: '#000', strokeThickness: 4 };
    this.timeText = this.add.text(12, 8, '', hudStyle);
    this.scoreText = this.add.text(12, 34, '', hudStyle);
    this.invText  = this.add.text(12, 60, '', hudStyle);
    this.updateHud();

    // Center-screen end message
    this.endText = this.add.text(GAME_W / 2, GAME_H / 2, '', {
      fontFamily: 'sans-serif', fontSize: '40px', color: '#fff',
      stroke: '#000', strokeThickness: 6, align: 'center'
    }).setOrigin(0.5).setVisible(false);

    // Countdown tick
    this.time.addEvent({
      delay: 1000, loop: true,
      callback: () => {
        if (this.gameEnded) return;
        this.timeLeft--;
        this.updateHud();
        if (this.timeLeft <= 0) this.endGame(false);
      }
    });

    // Music
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
    // Browsers block autoplay before user gesture — start on first key/click.
    const startBgm = () => { if (!this.bgm.isPlaying) this.bgm.play(); };
    this.input.keyboard.once('keydown', startBgm);
    this.input.once('pointerdown', startBgm);
  }

  makePlant(x, y) {
    const sprite = this.physics.add.staticImage(x, y, 'plant_stage_1')
      .setDisplaySize(60, 70).refreshBody();
    sprite.stage = 1;
    return sprite;
  }

  pickup(player, trash) {
    trash.destroy();
    this.inventory++;
    this.updateHud();
  }

  dropAtBin() {
    if (this.inventory === 0) return;
    this.score += this.inventory * 10;
    this.inventory = 0;
    this.updateHud();
  }

  waterNearestPlant() {
    let nearest = null, minDist = WATER_RANGE;
    for (const p of this.plants) {
      if (p.stage >= 3) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (d < minDist) { minDist = d; nearest = p; }
    }
    if (!nearest) return;

    nearest.stage++;
    nearest.setTexture(`plant_stage_${nearest.stage}`);
    nearest.setDisplaySize(60, 70).refreshBody();
    this.score += 20;
    this.updateHud();

    // Brief pouring animation: switch icon texture, hide after 300ms
    this.canIcon.setTexture('watering_can_pouring').setVisible(true);
    this.time.delayedCall(300, () => {
      this.canIcon.setTexture('watering_can').setVisible(false);
    });

    if (this.plants.every(p => p.stage >= 3)) this.endGame(true);
  }

  updateHud() {
    const m = Math.floor(this.timeLeft / 60);
    const s = String(this.timeLeft % 60).padStart(2, '0');
    this.timeText.setText(`⏱  ${m}:${s}`);
    this.scoreText.setText(`💯  ${this.score}`);
    this.invText.setText(`🗑  ${this.inventory} rác`);
  }

  endGame(won) {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.player.body.setVelocity(0, 0);
    this.endText.setText(
      won
        ? `🎉  HOÀN THÀNH!\nĐiểm: ${this.score}\n\nNhấn R để chơi lại`
        : `⏰  HẾT GIỜ\nĐiểm: ${this.score}\n\nNhấn R để chơi lại`
    ).setVisible(true);
  }

  update() {
    if (this.gameEnded) {
      if (Phaser.Input.Keyboard.JustDown(this.rKey)) this.scene.restart();
      return;
    }

    // Movement
    const left  = this.cursors.left.isDown  || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up    = this.cursors.up.isDown    || this.wasd.W.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.S.isDown;

    let vx = 0, vy = 0;
    if (left)  vx = -PLAYER_SPEED;
    if (right) vx =  PLAYER_SPEED;
    if (up)    vy = -PLAYER_SPEED;
    if (down)  vy =  PLAYER_SPEED;
    // Normalize diagonal
    if (vx !== 0 && vy !== 0) { vx *= Math.SQRT1_2; vy *= Math.SQRT1_2; }
    this.player.body.setVelocity(vx, vy);

    // Flip player based on horizontal direction
    if (vx < 0) this.player.setFlipX(true);
    else if (vx > 0) this.player.setFlipX(false);

    // Position watering can icon near player
    if (this.canIcon.visible) {
      this.canIcon.setPosition(this.player.x + 30, this.player.y - 10);
    }

    // Water on space
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.waterNearestPlant();
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_W,
  height: GAME_H,
  parent: 'game',
  backgroundColor: '#7ec0ee',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: MainScene
};

new Phaser.Game(config);
