import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SceneManager } from '../../src/core/scene-manager.js';

function createMockScene(name) {
  return {
    name,
    init: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  };
}

describe('SceneManager', () => {
  let manager;

  beforeEach(() => {
    manager = new SceneManager();
  });

  it('should register a scene', () => {
    const scene = createMockScene('title');
    manager.register('title', scene);
    expect(manager.has('title')).toBe(true);
  });

  it('should switch to a registered scene', () => {
    const scene = createMockScene('title');
    manager.register('title', scene);
    manager.switchTo('title');
    expect(manager.current).toBe(scene);
    expect(scene.init).toHaveBeenCalled();
  });

  it('should only have one active scene at a time', () => {
    const scene1 = createMockScene('title');
    const scene2 = createMockScene('game');
    manager.register('title', scene1);
    manager.register('game', scene2);

    manager.switchTo('title');
    manager.switchTo('game');

    expect(manager.current).toBe(scene2);
    expect(scene1.destroy).toHaveBeenCalled();
    expect(scene2.init).toHaveBeenCalled();
  });

  it('should call destroy on the old scene when switching', () => {
    const scene1 = createMockScene('title');
    const scene2 = createMockScene('game');
    manager.register('title', scene1);
    manager.register('game', scene2);

    manager.switchTo('title');
    manager.switchTo('game');

    expect(scene1.destroy).toHaveBeenCalledTimes(1);
  });

  it('should forward update calls to the current scene', () => {
    const scene = createMockScene('title');
    manager.register('title', scene);
    manager.switchTo('title');

    manager.update(16.67);
    expect(scene.update).toHaveBeenCalledWith(16.67);
  });

  it('should not call update when no scene is active', () => {
    // Should not throw
    expect(() => manager.update(16.67)).not.toThrow();
  });

  it('should pass data to scene init when switching', () => {
    const scene = createMockScene('game');
    manager.register('game', scene);
    manager.switchTo('game', { level: 1 });
    expect(scene.init).toHaveBeenCalledWith({ level: 1 });
  });

  it('should throw when switching to an unregistered scene', () => {
    expect(() => manager.switchTo('nonexistent')).toThrow();
  });
});
