// GameScene — gameplay chính. Khởi tạo theo levelId truyền từ Menu.
// Trách nhiệm: setup map/entities/HUD, vòng update, win/lose → GameOverScene.

import {
  GAME, COLORS, LEVELS, LEVEL1_LAYOUT,
  TRASH_TYPES, TRASH_FACTS, PLANT_GROWN_FACTS,
} from '../config.js';
import { Player } from '../entities/Player.js';
import { Plant } from '../entities/Plant.js';
import { sfx } from '../systems/sfx.js';

export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelConfig = LEVELS.find(l => l.id === data.levelId) || LEVELS[0];
  }

  create() {
    // State
    this.score = 0;
    this.inventory = 0;
    this.timeLeft = this.levelConfig.timeLimit;
    this.gameEnded = false;
    this.recentPickups = []; // timestamps for combo detection

    this._createBackground();
    this._createMudZones();
    this._createBin();
    this._createPlants();
    this._createTrash();
    this._createPlayer();
    this._setupInput();
    this._setupOverlaps();
    this._createHud();
    this._createPopupLayer();
    this._createEndText();
    this._startTimer();
    this._startMusic();
  }

  // ─────────────────────────────────────────────────────────
  // Setup helpers
  // ─────────────────────────────────────────────────────────

  _createBackground() {
    this.add.tileSprite(GAME.WIDTH / 2, GAME.HEIGHT / 2,
      GAME.WIDTH, GAME.HEIGHT, 'block_map').setTileScale(0.4, 0.4);
  }

  _createMudZones() {
    this.mudZones = [];
    for (let i = 0; i < this.levelConfig.mudCount; i++) {
      const x = Phaser.Math.Between(120, GAME.WIDTH - 120);
      const y = Phaser.Math.Between(120, GAME.HEIGHT - 120);
      const r = 50;
      const mud = this.add.circle(x, y, r, 0x6b4226, 0.45)
        .setStrokeStyle(2, 0x4a2818);
      mud.radius = r;
      this.mudZones.push(mud);
    }
  }

  _createBin() {
    const pos = this.levelConfig.id === 1
      ? LEVEL1_LAYOUT.bin
      : { x: 80, y: 100 };
    this.bin = this.physics.add.staticImage(pos.x, pos.y, 'trash_bin')
      .setDisplaySize(60, 80).refreshBody();
  }

  _createPlants() {
    this.plants = [];
    const positions = this.levelConfig.id === 1
      ? LEVEL1_LAYOUT.plants
      : this._randomPositions(this.levelConfig.plantCount, 80);
    positions.forEach(p => this.plants.push(new Plant(this, p.x, p.y)));
  }

  _createTrash() {
    this.trashGroup = this.physics.add.group();
    const items = this.levelConfig.id === 1
      ? LEVEL1_LAYOUT.trash
      : this._randomPositions(this.levelConfig.trashCount, 60).map(p => ({
          x: p.x, y: p.y, key: Phaser.Math.RND.pick(TRASH_TYPES),
        }));
    items.forEach(({ x, y, key }) => {
      const t = this.trashGroup.create(x, y, key).setDisplaySize(42, 42);
      t.body.setCircle(t.displayWidth / 2);
      // Subtle pulse
      this.tweens.add({
        targets: t, alpha: 0.7, yoyo: true, repeat: -1, duration: 700,
      });
    });
  }

  _createPlayer() {
    const start = this.levelConfig.id === 1
      ? LEVEL1_LAYOUT.player
      : { x: GAME.WIDTH / 2, y: GAME.HEIGHT / 2 };
    this.player = new Player(this, start.x, start.y);
  }

  _setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  _setupOverlaps() {
    this.physics.add.overlap(this.player, this.trashGroup, this._onPickup, null, this);
    this.physics.add.overlap(this.player, this.bin, this._onDropAtBin, null, this);
  }

  _createHud() {
    const style = { fontFamily: 'monospace', fontSize: '20px', color: COLORS.text,
                    stroke: '#000', strokeThickness: 4 };
    this.timeText  = this.add.text(12, 8,  '', style);
    this.scoreText = this.add.text(12, 34, '', style);
    this.invText   = this.add.text(12, 60, '', style);
    this.levelText = this.add.text(GAME.WIDTH - 12, 8,
      `Level ${this.levelConfig.id} — ${this.levelConfig.name}`, style).setOrigin(1, 0);
    this._refreshHud();
  }

  _createPopupLayer() {
    // Phaser tự stack text. Mỗi popup tự destroy sau 1.5s.
  }

  _createEndText() {
    this.endText = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT / 2, '', {
      fontFamily: 'sans-serif', fontSize: '40px', color: COLORS.text,
      stroke: '#000', strokeThickness: 6, align: 'center',
    }).setOrigin(0.5).setVisible(false);
  }

  _startTimer() {
    this.time.addEvent({
      delay: 1000, loop: true,
      callback: () => {
        if (this.gameEnded) return;
        this.timeLeft--;
        this._refreshHud();
        if (this.timeLeft <= 0) this._endGame(false);
      },
    });
  }

  _startMusic() {
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
    const start = () => { if (!this.bgm.isPlaying) this.bgm.play(); };
    this.input.keyboard.once('keydown', start);
    this.input.once('pointerdown', start);
  }

  // ─────────────────────────────────────────────────────────
  // Update loop
  // ─────────────────────────────────────────────────────────

  update() {
    if (this.gameEnded) return;
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.bgm?.stop();
      this.scene.start('Menu');
      return;
    }

    // Movement input
    const left  = this.cursors.left.isDown  || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up    = this.cursors.up.isDown    || this.wasd.W.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.S.isDown;
    const vx = (right ? 1 : 0) - (left ? 1 : 0);
    const vy = (down  ? 1 : 0) - (up   ? 1 : 0);

    // Mud slow check
    const inMud = this.mudZones.some(m =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, m.x, m.y) < m.radius);
    if (inMud) this.player.applyMudSlow(GAME.MUD_SLOW_FACTOR);
    else this.player.resetSpeed();

    this.player.setMoveInput(vx, vy);

    // Water on space
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this._tryWater();
  }

  // ─────────────────────────────────────────────────────────
  // Gameplay actions
  // ─────────────────────────────────────────────────────────

  _onPickup(player, trash) {
    if (this.inventory >= GAME.INVENTORY_MAX) return;
    const key = trash.texture.key;
    const x = trash.x, y = trash.y;
    trash.destroy();
    this.inventory++;
    this._refreshHud();
    sfx.pickup();
    this._showPopup(TRASH_FACTS[key] || '', x, y - 30);
    this._trackCombo();
  }

  _onDropAtBin() {
    if (this.inventory === 0) return;
    const points = this.inventory * GAME.SCORE_PER_TRASH;
    this.score += points;
    this.inventory = 0;
    this._refreshHud();
    sfx.drop();
    this._spawnParticles(this.bin.x, this.bin.y);
    this._showFloatingScore(`+${points}`, this.bin.x, this.bin.y - 50);
  }

  _tryWater() {
    let nearest = null, minDist = GAME.WATER_RANGE;
    for (const p of this.plants) {
      if (p.isMaxStage()) continue;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (d < minDist) { minDist = d; nearest = p; }
    }
    if (!nearest) return;

    if (nearest.water()) {
      this.score += GAME.SCORE_PER_WATER;
      this._refreshHud();
      sfx.water();
      this._showFloatingScore(`+${GAME.SCORE_PER_WATER}`, nearest.x, nearest.y - 50);
      if (nearest.isMaxStage()) {
        const fact = Phaser.Math.RND.pick(PLANT_GROWN_FACTS);
        this._showPopup(fact, nearest.x, nearest.y - 60, 2000);
      }
      if (this.plants.every(p => p.isMaxStage())) this._endGame(true);
    }
  }

  _trackCombo() {
    const now = this.time.now;
    this.recentPickups.push(now);
    this.recentPickups = this.recentPickups.filter(
      t => now - t <= GAME.COMBO_WINDOW_MS);
    if (this.recentPickups.length >= GAME.COMBO_THRESHOLD) {
      this.score += GAME.COMBO_BONUS;
      this._refreshHud();
      sfx.combo();
      this._showFloatingScore(`COMBO! +${GAME.COMBO_BONUS}`,
        this.player.x, this.player.y - 60, 0xffd166);
      this.recentPickups = [];
    }
  }

  // ─────────────────────────────────────────────────────────
  // Helpers (UI / FX)
  // ─────────────────────────────────────────────────────────

  _refreshHud() {
    const m = Math.floor(this.timeLeft / 60);
    const s = String(this.timeLeft % 60).padStart(2, '0');
    this.timeText.setText(`⏱  ${m}:${s}`);
    this.scoreText.setText(`💯  ${this.score}`);
    this.invText.setText(`🗑  ${this.inventory}/${GAME.INVENTORY_MAX}`);
  }

  _showPopup(text, x, y, duration = 1500) {
    if (!text) return;
    const t = this.add.text(x, y, text, {
      fontFamily: 'sans-serif', fontSize: '14px',
      color: '#fff', backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 },
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, y: y - 30, alpha: 0,
      duration, ease: 'Quad.easeOut',
      onComplete: () => t.destroy(),
    });
  }

  _showFloatingScore(text, x, y, colorHex) {
    const color = colorHex !== undefined
      ? Phaser.Display.Color.IntegerToColor(colorHex).rgba
      : '#8fd694';
    const t = this.add.text(x, y, text, {
      fontFamily: 'sans-serif', fontSize: '22px', color,
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: t, y: y - 40, alpha: 0, scale: 1.3,
      duration: 800, ease: 'Quad.easeOut',
      onComplete: () => t.destroy(),
    });
  }

  _spawnParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const dot = this.add.circle(x, y, 4, 0x8fd694);
      this.tweens.add({
        targets: dot,
        x: x + Phaser.Math.Between(-40, 40),
        y: y - Phaser.Math.Between(20, 60),
        alpha: 0,
        duration: 600,
        ease: 'Quad.easeOut',
        onComplete: () => dot.destroy(),
      });
    }
  }

  _randomPositions(count, minDist) {
    const pts = [];
    let safety = 0;
    while (pts.length < count && safety++ < 500) {
      const p = {
        x: Phaser.Math.Between(80, GAME.WIDTH - 80),
        y: Phaser.Math.Between(80, GAME.HEIGHT - 80),
      };
      if (pts.every(q => Phaser.Math.Distance.Between(p.x, p.y, q.x, q.y) > minDist)) {
        pts.push(p);
      }
    }
    return pts;
  }

  _endGame(won) {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.player.setMoveInput(0, 0);
    this.bgm?.stop();
    won ? sfx.win() : sfx.lose();
    this.time.delayedCall(800, () => {
      this.scene.start('GameOver', {
        won,
        score: this.score,
        levelId: this.levelConfig.id,
      });
    });
  }
}
