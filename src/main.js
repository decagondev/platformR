import { Application } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from './core/constants.js';

async function init() {
  const app = new Application();

  await app.init({
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x0a0a1a,
    resolution: 1,
    autoDensity: false,
    antialias: false,
    roundPixels: true,
  });

  document.body.appendChild(app.canvas);
  app.canvas.style.imageRendering = 'pixelated';

  scaleCanvas(app);
  window.addEventListener('resize', () => scaleCanvas(app));
}

function scaleCanvas(app) {
  const scaleX = Math.floor(window.innerWidth / GAME_WIDTH);
  const scaleY = Math.floor(window.innerHeight / GAME_HEIGHT);
  const scale = Math.max(1, Math.min(scaleX, scaleY));

  app.canvas.style.width = `${GAME_WIDTH * scale}px`;
  app.canvas.style.height = `${GAME_HEIGHT * scale}px`;
}

init();
