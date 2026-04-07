import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager } from '../../src/systems/audio.js';

// Mock AudioContext
class MockOscillator {
  constructor() {
    this.frequency = { setValueAtTime: vi.fn() };
    this.type = 'square';
  }
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode {
  constructor() {
    this.gain = { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  }
  connect = vi.fn();
}

class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator = vi.fn(() => new MockOscillator());
  createGain = vi.fn(() => new MockGainNode());
  resume = vi.fn(() => Promise.resolve());
}

describe('AudioManager', () => {
  let audio;
  let mockCtx;

  beforeEach(() => {
    mockCtx = new MockAudioContext();
    audio = new AudioManager(mockCtx);
  });

  it('should play a sound by name', () => {
    audio.play('jump');
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('should play distinct sounds for each event', () => {
    const sounds = ['jump', 'doubleJump', 'death', 'landing', 'levelComplete'];
    for (const name of sounds) {
      mockCtx.createOscillator.mockClear();
      audio.play(name);
      expect(mockCtx.createOscillator).toHaveBeenCalled();
    }
  });

  it('should not play sounds when muted', () => {
    audio.mute();
    audio.play('jump');
    expect(mockCtx.createOscillator).not.toHaveBeenCalled();
  });

  it('should resume playing after unmute', () => {
    audio.mute();
    audio.unmute();
    audio.play('jump');
    expect(mockCtx.createOscillator).toHaveBeenCalled();
  });

  it('should report muted state', () => {
    expect(audio.isMuted).toBe(false);
    audio.mute();
    expect(audio.isMuted).toBe(true);
    audio.unmute();
    expect(audio.isMuted).toBe(false);
  });

  it('should not throw for unknown sound names', () => {
    expect(() => audio.play('nonexistent')).not.toThrow();
  });
});
