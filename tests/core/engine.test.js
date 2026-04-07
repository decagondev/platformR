// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Engine } from '../../src/core/engine.js';

// Mock pixi.js
vi.mock('pixi.js', () => {
  class MockContainer {
    constructor() {
      this.children = [];
    }
    addChild(child) {
      this.children.push(child);
    }
  }

  class MockApplication {
    constructor() {
      this.stage = new MockContainer();
      this.ticker = {
        add: vi.fn(),
        maxFPS: 60,
      };
      this.canvas = document.createElement('canvas');
    }
    async init() {}
  }

  return { Application: MockApplication, Container: MockContainer };
});

describe('Engine', () => {
  let engine;

  beforeEach(async () => {
    engine = new Engine();
    await engine.init();
  });

  it('should initialize the PixiJS application', () => {
    expect(engine.app).toBeDefined();
  });

  it('should create worldContainer and uiContainer', () => {
    expect(engine.worldContainer).toBeDefined();
    expect(engine.uiContainer).toBeDefined();
  });

  it('should add both containers to the stage', () => {
    const stageChildren = engine.app.stage.children;
    expect(stageChildren).toContain(engine.worldContainer);
    expect(stageChildren).toContain(engine.uiContainer);
  });

  it('should add worldContainer before uiContainer', () => {
    const stageChildren = engine.app.stage.children;
    const worldIndex = stageChildren.indexOf(engine.worldContainer);
    const uiIndex = stageChildren.indexOf(engine.uiContainer);
    expect(worldIndex).toBeLessThan(uiIndex);
  });

  it('should register an update callback on the ticker', () => {
    expect(engine.app.ticker.add).toHaveBeenCalled();
  });

  it('should call registered update listeners with delta time', () => {
    const listener = vi.fn();
    engine.onUpdate(listener);

    // Simulate a tick
    const tickerCallback = engine.app.ticker.add.mock.calls[0][0];
    const mockTicker = { deltaMS: 16.67 };
    tickerCallback(mockTicker);

    expect(listener).toHaveBeenCalledWith(16.67);
  });

  it('should support removing update listeners', () => {
    const listener = vi.fn();
    const unsubscribe = engine.onUpdate(listener);
    unsubscribe();

    const tickerCallback = engine.app.ticker.add.mock.calls[0][0];
    tickerCallback({ deltaMS: 16.67 });

    expect(listener).not.toHaveBeenCalled();
  });
});
