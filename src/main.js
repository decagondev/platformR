import { Engine } from './core/engine.js';
import { GAME_WIDTH, GAME_HEIGHT } from './core/constants.js';

async function init() {
  const engine = new Engine();
  await engine.init();

  document.body.appendChild(engine.app.canvas);
  engine.app.canvas.style.imageRendering = 'pixelated';

  scaleCanvas(engine.app);
  window.addEventListener('resize', () => scaleCanvas(engine.app));
}

function scaleCanvas(app) {
  const scaleX = Math.floor(window.innerWidth / GAME_WIDTH);
  const scaleY = Math.floor(window.innerHeight / GAME_HEIGHT);
  const scale = Math.max(1, Math.min(scaleX, scaleY));

  app.canvas.style.width = `${GAME_WIDTH * scale}px`;
  app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

init();
