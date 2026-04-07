import { describe, it, expect } from 'vitest';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from '../src/core/constants.js';

describe('Game Constants', () => {
  it('should define the game resolution as 320x180', () => {
    expect(GAME_WIDTH).toBe(320);
    expect(GAME_HEIGHT).toBe(180);
  });

  it('should define tile size as 16', () => {
    expect(TILE_SIZE).toBe(16);
  });

  it('should have a width that divides evenly by tile size', () => {
    expect(GAME_WIDTH % TILE_SIZE).toBe(0);
  });
});
