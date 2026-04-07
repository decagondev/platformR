import { describe, it, expect, beforeEach } from 'vitest';
import { LevelCompleteDetector } from '../../src/systems/level-complete.js';
import { TileMap, TileTypes } from '../../src/systems/tile-map.js';
import { TILE_SIZE } from '../../src/core/constants.js';

describe('LevelCompleteDetector', () => {
  let detector;
  let tileMap;

  // Exit at col 4, row 0
  const levelData = {
    name: 'Test',
    tiles: [
      [0, 0, 0, 0, 5],
      [1, 1, 1, 1, 1],
    ],
  };

  beforeEach(() => {
    tileMap = new TileMap();
    tileMap.load(levelData);
    detector = new LevelCompleteDetector(tileMap);
  });

  it('should detect when player overlaps exit tile', () => {
    // Player overlapping exit at (4*16, 0*16) = (64, 0)
    const player = { x: 60, y: 0, width: 12, height: 14 };
    expect(detector.check(player)).toBe(true);
  });

  it('should not detect completion when player is away from exit', () => {
    const player = { x: 0, y: 0, width: 12, height: 14 };
    expect(detector.check(player)).toBe(false);
  });

  it('should detect completion when player partially overlaps exit', () => {
    // Player right edge crosses into exit tile column
    const player = { x: 55, y: 0, width: 12, height: 14 };
    expect(detector.check(player)).toBe(true);
  });
});
