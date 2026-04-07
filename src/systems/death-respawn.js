import { TILE_SIZE } from '../core/constants.js';

export class DeathRespawnSystem {
  spawnX = 0;
  spawnY = 0;
  deathCount = 0;
  #onDeath;

  constructor(onDeath) {
    this.#onDeath = onDeath || (() => {});
  }

  setSpawnPoint(col, row) {
    this.spawnX = col * TILE_SIZE;
    this.spawnY = row * TILE_SIZE;
  }

  touchCheckpoint(col, row) {
    this.spawnX = col * TILE_SIZE;
    this.spawnY = row * TILE_SIZE;
  }

  die(player) {
    this.deathCount++;
    this.#onDeath(player.x, player.y);
    player.respawn(this.spawnX, this.spawnY);
  }

  reset() {
    this.deathCount = 0;
  }
}
