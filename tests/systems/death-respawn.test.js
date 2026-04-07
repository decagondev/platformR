import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeathRespawnSystem } from '../../src/systems/death-respawn.js';
import { TILE_SIZE } from '../../src/core/constants.js';

function createMockPlayer(x, y) {
  return {
    x,
    y,
    vx: 3,
    vy: -2,
    width: 12,
    height: 14,
    jumpState: 'doubleJumped',
    respawn: vi.fn(function (rx, ry) {
      this.x = rx;
      this.y = ry;
      this.vx = 0;
      this.vy = 0;
      this.jumpState = 'grounded';
    }),
  };
}

describe('DeathRespawnSystem', () => {
  let system;
  let onDeath;

  beforeEach(() => {
    onDeath = vi.fn();
    system = new DeathRespawnSystem(onDeath);
  });

  it('should initialize with zero deaths', () => {
    expect(system.deathCount).toBe(0);
  });

  it('should set initial spawn point', () => {
    system.setSpawnPoint(2, 5);
    expect(system.spawnX).toBe(2 * TILE_SIZE);
    expect(system.spawnY).toBe(5 * TILE_SIZE);
  });

  it('should update active checkpoint when touched', () => {
    system.setSpawnPoint(0, 0);
    system.touchCheckpoint(10, 3);
    expect(system.spawnX).toBe(10 * TILE_SIZE);
    expect(system.spawnY).toBe(3 * TILE_SIZE);
  });

  it('should trigger death and respawn player at spawn point', () => {
    const player = createMockPlayer(200, 100);
    system.setSpawnPoint(1, 8);
    system.die(player);

    expect(player.respawn).toHaveBeenCalledWith(
      1 * TILE_SIZE,
      8 * TILE_SIZE,
    );
    expect(system.deathCount).toBe(1);
    expect(onDeath).toHaveBeenCalledWith(200, 100);
  });

  it('should increment death counter on each death', () => {
    const player = createMockPlayer(50, 50);
    system.setSpawnPoint(0, 0);
    system.die(player);
    system.die(player);
    system.die(player);
    expect(system.deathCount).toBe(3);
  });

  it('should respawn at checkpoint after touching it', () => {
    const player = createMockPlayer(200, 100);
    system.setSpawnPoint(0, 0);
    system.touchCheckpoint(5, 2);
    system.die(player);
    expect(player.respawn).toHaveBeenCalledWith(
      5 * TILE_SIZE,
      2 * TILE_SIZE,
    );
  });

  it('should call onDeath callback with player position', () => {
    const player = createMockPlayer(150, 80);
    system.setSpawnPoint(0, 0);
    system.die(player);
    expect(onDeath).toHaveBeenCalledWith(150, 80);
  });

  it('should reset death count', () => {
    const player = createMockPlayer(50, 50);
    system.setSpawnPoint(0, 0);
    system.die(player);
    system.die(player);
    system.reset();
    expect(system.deathCount).toBe(0);
  });
});
