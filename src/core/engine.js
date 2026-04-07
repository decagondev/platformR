import { Application, Container } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

export class Engine {
  app = null;
  worldContainer = null;
  uiContainer = null;
  #updateListeners = [];

  async init() {
    this.app = new Application();

    await this.app.init({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x0a0a1a,
      resolution: 1,
      autoDensity: false,
      antialias: false,
      roundPixels: true,
    });

    this.app.ticker.maxFPS = 60;

    this.worldContainer = new Container();
    this.uiContainer = new Container();
    this.app.stage.addChild(this.worldContainer);
    this.app.stage.addChild(this.uiContainer);

    this.app.ticker.add((ticker) => {
      const dt = ticker.deltaMS;
      for (let i = 0; i < this.#updateListeners.length; i++) {
        this.#updateListeners[i](dt);
      }
    });
  }

  onUpdate(listener) {
    this.#updateListeners.push(listener);
    return () => {
      const idx = this.#updateListeners.indexOf(listener);
      if (idx !== -1) this.#updateListeners.splice(idx, 1);
    };
  }
}
