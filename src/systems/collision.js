import { TILE_SIZE } from '../core/constants.js';
import { TileTypes } from './tile-map.js';

export class CollisionSystem {
  #tileMap;

  constructor(tileMap) {
    this.#tileMap = tileMap;
  }

  resolve(entity) {
    const result = {
      collidedX: false,
      collidedY: false,
      hitSpike: false,
      hitKillPlane: false,
    };

    // Kill plane check
    if (entity.y > this.#tileMap.worldHeight) {
      result.hitKillPlane = true;
      return result;
    }

    // Horizontal resolution
    entity.x += entity.vx;
    result.collidedX = this.#resolveAxis(entity, 'x');

    // Vertical resolution
    const prevY = entity.y;
    entity.y += entity.vy;
    result.collidedY = this.#resolveAxis(entity, 'y');

    // Grounded check: entity is grounded if it collided downward
    entity.grounded = result.collidedY && entity.vy >= 0;

    if (result.collidedY) {
      entity.vy = 0;
    }
    if (result.collidedX) {
      entity.vx = 0;
    }

    // Spike check (top contact only: entity was moving down and lands on spike)
    if (entity.vy >= 0 || result.collidedY) {
      result.hitSpike = this.#checkSpike(entity, prevY);
    }

    return result;
  }

  #resolveAxis(entity, axis) {
    const left = Math.floor(entity.x / TILE_SIZE);
    const right = Math.floor((entity.x + entity.width - 0.01) / TILE_SIZE);
    const top = Math.floor(entity.y / TILE_SIZE);
    const bottom = Math.floor((entity.y + entity.height - 0.01) / TILE_SIZE);

    let collided = false;

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (!this.#tileMap.isSolid(col, row)) continue;

        const tileLeft = col * TILE_SIZE;
        const tileRight = tileLeft + TILE_SIZE;
        const tileTop = row * TILE_SIZE;
        const tileBottom = tileTop + TILE_SIZE;

        if (axis === 'x') {
          if (entity.vx > 0) {
            entity.x = tileLeft - entity.width;
          } else if (entity.vx < 0) {
            entity.x = tileRight;
          }
        } else {
          if (entity.vy > 0) {
            entity.y = tileTop - entity.height;
          } else if (entity.vy < 0) {
            entity.y = tileBottom;
          }
        }
        collided = true;
      }
    }

    return collided;
  }

  #checkSpike(entity, prevY) {
    // Only check if entity was above the spike before (top contact)
    const footY = entity.y + entity.height;
    const left = Math.floor(entity.x / TILE_SIZE);
    const right = Math.floor((entity.x + entity.width - 0.01) / TILE_SIZE);
    const footRow = Math.floor(footY / TILE_SIZE);

    // Check that entity was above this row in previous frame
    const prevFootY = prevY + entity.height;
    const prevFootRow = Math.floor(prevFootY / TILE_SIZE);

    for (let col = left; col <= right; col++) {
      if (this.#tileMap.getTileAt(col, footRow) === TileTypes.SPIKE) {
        // Top contact: entity feet are entering spike row from above
        if (prevFootRow < footRow) {
          return true;
        }
      }
    }
    return false;
  }
}
