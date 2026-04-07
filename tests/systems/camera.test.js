import { describe, it, expect, beforeEach } from 'vitest';
import { Camera, DEAD_ZONE } from '../../src/systems/camera.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../../src/core/constants.js';

describe('Camera', () => {
  let camera;

  beforeEach(() => {
    // Level: 640x360 (wider and taller than screen)
    camera = new Camera(640, 360);
  });

  it('should follow a target position with lerp', () => {
    camera.setTarget(200, 80);
    camera.update();
    // Camera should move toward target but not arrive instantly (lerp)
    expect(camera.x).toBeGreaterThan(0);
    expect(camera.x).toBeLessThan(200 - GAME_WIDTH / 2);
  });

  it('should converge on target after many updates', () => {
    camera.setTarget(200, 80);
    for (let i = 0; i < 100; i++) {
      camera.update();
    }
    const expectedX = 200 - GAME_WIDTH / 2;
    expect(Math.abs(camera.x - expectedX)).toBeLessThan(DEAD_ZONE + 1);
  });

  it('should not move when target is within dead zone', () => {
    // Set camera to center on a point
    camera.x = 100;
    camera.y = 50;
    // Target very close to where camera is already centered
    camera.setTarget(100 + GAME_WIDTH / 2 + 1, 50 + GAME_HEIGHT / 2 + 1);
    const prevX = camera.x;
    const prevY = camera.y;
    camera.update();
    // Should barely move due to dead zone
    expect(Math.abs(camera.x - prevX)).toBeLessThan(5);
  });

  it('should clamp to left edge of level', () => {
    camera.setTarget(0, 80);
    for (let i = 0; i < 100; i++) {
      camera.update();
    }
    expect(camera.x).toBeGreaterThanOrEqual(0);
  });

  it('should clamp to right edge of level', () => {
    camera.setTarget(640, 80);
    for (let i = 0; i < 100; i++) {
      camera.update();
    }
    expect(camera.x + GAME_WIDTH).toBeLessThanOrEqual(640);
  });

  it('should clamp to top edge of level', () => {
    camera.setTarget(200, 0);
    for (let i = 0; i < 100; i++) {
      camera.update();
    }
    expect(camera.y).toBeGreaterThanOrEqual(0);
  });

  it('should clamp to bottom edge of level', () => {
    camera.setTarget(200, 360);
    for (let i = 0; i < 100; i++) {
      camera.update();
    }
    expect(camera.y + GAME_HEIGHT).toBeLessThanOrEqual(360);
  });

  it('should provide container offset (negative of camera position)', () => {
    camera.x = 100;
    camera.y = 50;
    expect(camera.offsetX).toBe(-100);
    expect(camera.offsetY).toBe(-50);
  });
});
