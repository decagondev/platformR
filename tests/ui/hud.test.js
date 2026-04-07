import { describe, it, expect, beforeEach } from 'vitest';
import { HudState } from '../../src/ui/hud.js';

describe('HudState', () => {
  let hud;

  beforeEach(() => {
    hud = new HudState();
  });

  it('should initialize with zero deaths', () => {
    expect(hud.deathCount).toBe(0);
  });

  it('should initialize with empty level name', () => {
    expect(hud.levelName).toBe('');
  });

  it('should initialize timer at zero', () => {
    expect(hud.timerMs).toBe(0);
  });

  it('should update death count', () => {
    hud.setDeathCount(5);
    expect(hud.deathCount).toBe(5);
  });

  it('should update level name', () => {
    hud.setLevelName('Station Alpha');
    expect(hud.levelName).toBe('Station Alpha');
  });

  it('should tick timer when not paused', () => {
    hud.tick(16.67);
    expect(hud.timerMs).toBeCloseTo(16.67);
  });

  it('should not tick timer when paused', () => {
    hud.paused = true;
    hud.tick(16.67);
    expect(hud.timerMs).toBe(0);
  });

  it('should format timer as mm:ss.ms', () => {
    hud.timerMs = 65432; // 1 min, 5 sec, 432 ms
    expect(hud.formattedTime).toBe('01:05.43');
  });

  it('should format zero time correctly', () => {
    expect(hud.formattedTime).toBe('00:00.00');
  });

  it('should reset timer', () => {
    hud.tick(5000);
    hud.resetTimer();
    expect(hud.timerMs).toBe(0);
  });
});
