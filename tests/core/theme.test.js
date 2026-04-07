import { describe, it, expect } from 'vitest';
import { Theme } from '../../src/core/theme.js';

describe('Theme', () => {
  it('should define background colors', () => {
    expect(Theme.bg).toBeDefined();
    expect(Theme.bgLight).toBeDefined();
  });

  it('should define player as the brightest color', () => {
    // Player should be a bright neon color (high value)
    expect(Theme.player).toBeDefined();
    expect(Theme.player).not.toBe(Theme.platform);
  });

  it('should define platform as distinct from player and background', () => {
    expect(Theme.platform).toBeDefined();
    expect(Theme.platform).not.toBe(Theme.player);
    expect(Theme.platform).not.toBe(Theme.bg);
  });

  it('should define spike as visually distinct', () => {
    expect(Theme.spike).toBeDefined();
    expect(Theme.spike).not.toBe(Theme.platform);
    expect(Theme.spike).not.toBe(Theme.player);
  });

  it('should define UI text colors', () => {
    expect(Theme.uiText).toBeDefined();
    expect(Theme.uiTextBright).toBeDefined();
    expect(Theme.uiTextDim).toBeDefined();
    expect(Theme.uiHighlight).toBeDefined();
  });

  it('should define particle colors array', () => {
    expect(Theme.particleColors).toBeInstanceOf(Array);
    expect(Theme.particleColors.length).toBeGreaterThan(0);
  });

  it('should define font settings', () => {
    expect(Theme.fontFamily).toBe('monospace');
    expect(Theme.fontSizeSmall).toBeLessThan(Theme.fontSizeMedium);
    expect(Theme.fontSizeMedium).toBeLessThan(Theme.fontSizeLarge);
    expect(Theme.fontSizeLarge).toBeLessThan(Theme.fontSizeTitle);
  });
});
