import { describe, it, expect, beforeEach } from 'vitest';
import { CollisionSystem } from '../../src/systems/collision.js';
import { TileMap, TileTypes } from '../../src/systems/tile-map.js';
import { TILE_SIZE } from '../../src/core/constants.js';

function createEntity(x, y, w, h) {
  return { x, y, width: w || 12, height: h || 14, vx: 0, vy: 0, grounded: false };
}

describe('CollisionSystem', () => {
  let collision;
  let tileMap;

  // Level layout (5 wide, 4 tall):
  // Row 0: [0, 0, 0, 0, 0]  (empty)
  // Row 1: [0, 0, 0, 0, 0]  (empty)
  // Row 2: [0, 0, 2, 0, 0]  (spike at col 2)
  // Row 3: [1, 1, 1, 1, 1]  (solid floor)
  const levelData = {
    name: 'Collision Test',
    tiles: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1],
    ],
  };

  beforeEach(() => {
    tileMap = new TileMap();
    tileMap.load(levelData);
    collision = new CollisionSystem(tileMap);
  });

  it('should detect AABB overlap between entity and solid tile', () => {
    // Entity sitting on top of the floor (row 3 starts at y=48)
    const entity = createEntity(8, 46, 12, 14);
    entity.vy = 2; // moving down
    const result = collision.resolve(entity);
    expect(result.collidedY).toBe(true);
  });

  it('should resolve entity position above solid platform', () => {
    const entity = createEntity(8, 36, 12, 14);
    entity.vy = 5; // falling into floor
    collision.resolve(entity);
    // Entity bottom should be at top of floor tile (y=48)
    expect(entity.y + entity.height).toBeLessThanOrEqual(3 * TILE_SIZE + 0.01);
  });

  it('should set grounded state when landing on platform', () => {
    const entity = createEntity(8, 33, 12, 14);
    entity.vy = 2;
    collision.resolve(entity);
    expect(entity.grounded).toBe(true);
  });

  it('should not set grounded when in the air', () => {
    const entity = createEntity(8, 10, 12, 14);
    entity.vy = 0;
    collision.resolve(entity);
    expect(entity.grounded).toBe(false);
  });

  it('should detect spike collision from top only', () => {
    // Spike at col 2, row 2 (world: x=32, y=32)
    // Entity falling onto spike from above — feet at y=17+14=31 (row 1), after vy feet at 31+5=36 (row 2 = spike)
    const entity = createEntity(33, 17, 12, 14);
    entity.vy = 5;
    const result = collision.resolve(entity);
    expect(result.hitSpike).toBe(true);
  });

  it('should not detect spike collision from the side', () => {
    // Entity at same height as spike, moving right into it
    const entity = createEntity(20, 34, 12, 14);
    entity.vx = 3;
    entity.vy = 0;
    const result = collision.resolve(entity);
    expect(result.hitSpike).toBe(false);
  });

  it('should detect kill plane when entity falls below level', () => {
    const entity = createEntity(8, 100, 12, 14); // way below level
    const result = collision.resolve(entity);
    expect(result.hitKillPlane).toBe(true);
  });

  it('should not detect kill plane for entities within level bounds', () => {
    const entity = createEntity(8, 10, 12, 14);
    const result = collision.resolve(entity);
    expect(result.hitKillPlane).toBe(false);
  });

  it('should resolve horizontal collisions against solid tiles', () => {
    // Create a level with a wall
    const wallLevel = {
      name: 'Wall Test',
      tiles: [
        [0, 1],
        [0, 1],
      ],
    };
    const wallMap = new TileMap();
    wallMap.load(wallLevel);
    const wallCollision = new CollisionSystem(wallMap);

    const entity = createEntity(5, 4, 12, 14);
    entity.vx = 5; // moving right into wall
    wallCollision.resolve(entity);
    // Entity right edge should not exceed wall left edge
    expect(entity.x + entity.width).toBeLessThanOrEqual(TILE_SIZE + 0.01);
  });
});
