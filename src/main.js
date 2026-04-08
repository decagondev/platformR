import { Engine } from './core/engine.js';
import { GAME_WIDTH, GAME_HEIGHT } from './core/constants.js';
import { SceneManager } from './core/scene-manager.js';
import { InputSystem } from './systems/input.js';
import { AudioManager } from './systems/audio.js';
import { TitleScene } from './scenes/title-scene.js';
import { GameScene } from './scenes/game-scene.js';
import { WinScene } from './scenes/win-scene.js';
import { levels } from './levels/manifest.js';

async function init() {
  const engine = new Engine();
  await engine.init();

  document.body.appendChild(engine.app.canvas);
  engine.app.canvas.style.imageRendering = 'pixelated';

  scaleCanvas(engine.app);
  window.addEventListener('resize', () => scaleCanvas(engine.app));

  // Systems
  const input = new InputSystem();
  input.attach();

  const audio = new AudioManager(
    typeof AudioContext !== 'undefined' ? new AudioContext() : null,
  );

  // Scene manager
  const sceneManager = new SceneManager();

  const titleScene = new TitleScene(engine, sceneManager, input, levels);
  const gameScene = new GameScene(engine, sceneManager, input, audio);
  const winScene = new WinScene(engine, sceneManager, input, levels);

  sceneManager.register('title', titleScene);
  sceneManager.register('game', gameScene);
  sceneManager.register('win', winScene);

  // Game loop
  engine.onUpdate((dt) => {
    sceneManager.update(dt);
    input.update();
  });

  // Start
  sceneManager.switchTo('title');
}

function scaleCanvas(app) {
  const scaleX = Math.floor(window.innerWidth / GAME_WIDTH);
  const scaleY = Math.floor(window.innerHeight / GAME_HEIGHT);
  const scale = Math.max(1, Math.min(scaleX, scaleY));

  app.canvas.style.width = `${GAME_WIDTH * scale}px`;
  app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

init();
