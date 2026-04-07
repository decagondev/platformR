import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';

const LERP_SPEED = 0.1;
export const DEAD_ZONE = 4;

export class Camera {
  x = 0;
  y = 0;
  #targetX = 0;
  #targetY = 0;
  #levelWidth;
  #levelHeight;

  constructor(levelWidth, levelHeight) {
    this.#levelWidth = levelWidth;
    this.#levelHeight = levelHeight;
  }

  get offsetX() {
    return -this.x;
  }

  get offsetY() {
    return -this.y;
  }

  setTarget(worldX, worldY) {
    this.#targetX = worldX - GAME_WIDTH / 2;
    this.#targetY = worldY - GAME_HEIGHT / 2;
  }

  update() {
    const dx = this.#targetX - this.x;
    const dy = this.#targetY - this.y;

    if (Math.abs(dx) > DEAD_ZONE) {
      this.x += dx * LERP_SPEED;
    }
    if (Math.abs(dy) > DEAD_ZONE) {
      this.y += dy * LERP_SPEED;
    }

    // Clamp to level bounds
    this.x = Math.max(0, Math.min(this.x, this.#levelWidth - GAME_WIDTH));
    this.y = Math.max(0, Math.min(this.y, this.#levelHeight - GAME_HEIGHT));
  }
}
