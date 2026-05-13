// Entry point — config Phaser + đăng ký scene.
// Browser load Phaser từ CDN (window.Phaser) trước, sau đó load module này.

import { GAME } from './config.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { HowToScene } from './scenes/HowToScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  parent: 'game',
  backgroundColor: '#1a1a1a',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [PreloadScene, MenuScene, HowToScene, GameScene, GameOverScene],
});
