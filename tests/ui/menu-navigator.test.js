import { describe, it, expect, beforeEach } from 'vitest';
import { MenuNavigator } from '../../src/ui/menu-navigator.js';

describe('MenuNavigator', () => {
  let nav;

  beforeEach(() => {
    nav = new MenuNavigator(['Start Game', 'Level Select']);
  });

  it('should start with first option selected', () => {
    expect(nav.selectedIndex).toBe(0);
  });

  it('should navigate down', () => {
    nav.down();
    expect(nav.selectedIndex).toBe(1);
  });

  it('should wrap down to first option', () => {
    nav.down();
    nav.down();
    expect(nav.selectedIndex).toBe(0);
  });

  it('should navigate up with wrap', () => {
    nav.up();
    expect(nav.selectedIndex).toBe(1);
  });

  it('should return selected option on confirm', () => {
    expect(nav.confirm()).toBe('Start Game');
    nav.down();
    expect(nav.confirm()).toBe('Level Select');
  });

  it('should reset to first option', () => {
    nav.down();
    nav.reset();
    expect(nav.selectedIndex).toBe(0);
  });

  it('should support dynamic options list', () => {
    nav.setOptions(['A', 'B', 'C']);
    expect(nav.options).toEqual(['A', 'B', 'C']);
    expect(nav.selectedIndex).toBe(0);
  });
});
