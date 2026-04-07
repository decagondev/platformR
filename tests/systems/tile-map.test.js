import { describe, it, expect, beforeEach } from 'vitest';
import { TileMap, TileTypes } from '../../src/systems/tile-map.js';
import { TILE_SIZE } from '../../src/core/constants.js';

describe('TileMap', () => {
  const simpleLevelData = {
    name: 'Test Level',
    tiles: [
      [1, 1, 0, 0, 5],
      [0, 0, 0, 2, 0],
      [3, 0, 4, 1, 1],
    ],
  };

  let tileMap;

  beforeEach(() => {
    tileMap = new TileMap();
    tileMap.load(simpleLevelData);
  });

  it('should parse level data correctly', () => {
    expect(tileMap.width).toBe(5);
    expect(tileMap.height).toBe(3);
  });

  it('should return correct tile type at grid position', () => {
    expect(tileMap.getTileAt(0, 0)).toBe(TileTypes.PLATFORM);
    expect(tileMap.getTileAt(2, 0)).toBe(TileTypes.EMPTY);
    expect(tileMap.getTileAt(4, 0)).toBe(TileTypes.EXIT);
    expect(tileMap.getTileAt(3, 1)).toBe(TileTypes.SPIKE);
    expect(tileMap.getTileAt(0, 2)).toBe(TileTypes.SPAWN);
    expect(tileMap.getTileAt(2, 2)).toBe(TileTypes.CHECKPOINT);
  });

  it('should return EMPTY for out-of-bounds positions', () => {
    expect(tileMap.getTileAt(-1, 0)).toBe(TileTypes.EMPTY);
    expect(tileMap.getTileAt(99, 0)).toBe(TileTypes.EMPTY);
    expect(tileMap.getTileAt(0, -1)).toBe(TileTypes.EMPTY);
    expect(tileMap.getTileAt(0, 99)).toBe(TileTypes.EMPTY);
  });

  it('should convert world position to tile type', () => {
    // tile (0,0) is PLATFORM, world pos (8, 8) is center of that tile
    expect(tileMap.getTileAtWorld(8, 8)).toBe(TileTypes.PLATFORM);
    // tile (2,0) is EMPTY, world pos (40, 8) is center
    expect(tileMap.getTileAtWorld(40, 8)).toBe(TileTypes.EMPTY);
  });

  it('should find spawn position', () => {
    const spawn = tileMap.findTile(TileTypes.SPAWN);
    expect(spawn).toEqual({ col: 0, row: 2 });
  });

  it('should find all checkpoints', () => {
    const checkpoints = tileMap.findAllTiles(TileTypes.CHECKPOINT);
    expect(checkpoints).toHaveLength(1);
    expect(checkpoints[0]).toEqual({ col: 2, row: 2 });
  });

  it('should find exit tile', () => {
    const exit = tileMap.findTile(TileTypes.EXIT);
    expect(exit).toEqual({ col: 4, row: 0 });
  });

  it('should report level name', () => {
    expect(tileMap.name).toBe('Test Level');
  });

  it('should report world dimensions in pixels', () => {
    expect(tileMap.worldWidth).toBe(5 * TILE_SIZE);
    expect(tileMap.worldHeight).toBe(3 * TILE_SIZE);
  });

  it('should check if a tile is solid', () => {
    expect(tileMap.isSolid(0, 0)).toBe(true);
    expect(tileMap.isSolid(2, 0)).toBe(false);
    expect(tileMap.isSolid(3, 1)).toBe(false); // spike is not solid
  });
});

describe('TileMap - Level Registry', () => {
  it('should support loading multiple levels', () => {
    const tileMap = new TileMap();
    const level1 = { name: 'Level 1', tiles: [[1, 0], [0, 1]] };
    const level2 = { name: 'Level 2', tiles: [[0, 1], [1, 0]] };

    tileMap.load(level1);
    expect(tileMap.name).toBe('Level 1');

    tileMap.load(level2);
    expect(tileMap.name).toBe('Level 2');
    expect(tileMap.getTileAt(0, 0)).toBe(TileTypes.EMPTY);
  });
});
