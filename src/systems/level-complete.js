import { TILE_SIZE } from '../core/constants.js';
import { TileTypes } from './tile-map.js';

export class LevelCompleteDetector {
  #tileMap;

  constructor(tileMap) {
    this.#tileMap = tileMap;
  }

  check(player) {
    const left = Math.floor(player.x / TILE_SIZE);
    const right = Math.floor((player.x + player.width - 0.01) / TILE_SIZE);
    const top = Math.floor(player.y / TILE_SIZE);
    const bottom = Math.floor(
      (player.y + player.height - 0.01) / TILE_SIZE,
    );

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (this.#tileMap.getTileAt(col, row) === TileTypes.EXIT) {
          return true;
        }
      }
    }
    return false;
  }
}
