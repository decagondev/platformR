import { TILE_SIZE } from '../core/constants.js';

export const TileTypes = {
  EMPTY: 0,
  PLATFORM: 1,
  SPIKE: 2,
  SPAWN: 3,
  CHECKPOINT: 4,
  EXIT: 5,
};

export class TileMap {
  #tiles = [];
  #name = '';
  #width = 0;
  #height = 0;

  get name() {
    return this.#name;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get worldWidth() {
    return this.#width * TILE_SIZE;
  }

  get worldHeight() {
    return this.#height * TILE_SIZE;
  }

  load(levelData) {
    this.#name = levelData.name;
    this.#tiles = levelData.tiles;
    this.#height = this.#tiles.length;
    this.#width = this.#height > 0 ? this.#tiles[0].length : 0;
  }

  getTileAt(col, row) {
    if (col < 0 || col >= this.#width || row < 0 || row >= this.#height) {
      return TileTypes.EMPTY;
    }
    return this.#tiles[row][col];
  }

  getTileAtWorld(worldX, worldY) {
    const col = Math.floor(worldX / TILE_SIZE);
    const row = Math.floor(worldY / TILE_SIZE);
    return this.getTileAt(col, row);
  }

  isSolid(col, row) {
    return this.getTileAt(col, row) === TileTypes.PLATFORM;
  }

  findTile(type) {
    for (let row = 0; row < this.#height; row++) {
      for (let col = 0; col < this.#width; col++) {
        if (this.#tiles[row][col] === type) {
          return { col, row };
        }
      }
    }
    return null;
  }

  findAllTiles(type) {
    const results = [];
    for (let row = 0; row < this.#height; row++) {
      for (let col = 0; col < this.#width; col++) {
        if (this.#tiles[row][col] === type) {
          results.push({ col, row });
        }
      }
    }
    return results;
  }
}
