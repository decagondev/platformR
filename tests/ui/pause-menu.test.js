import { describe, it, expect, beforeEach } from 'vitest';
import { PauseMenu } from '../../src/ui/pause-menu.js';

describe('PauseMenu', () => {
  let menu;

  beforeEach(() => {
    menu = new PauseMenu();
  });

  it('should start not visible', () => {
    expect(menu.visible).toBe(false);
  });

  it('should become visible when opened', () => {
    menu.open();
    expect(menu.visible).toBe(true);
  });

  it('should become hidden when closed', () => {
    menu.open();
    menu.close();
    expect(menu.visible).toBe(false);
  });

  it('should have three menu options', () => {
    expect(menu.options).toEqual(['Resume', 'Restart Level', 'Quit to Title']);
  });

  it('should start with first option selected', () => {
    menu.open();
    expect(menu.selectedIndex).toBe(0);
  });

  it('should navigate down through options', () => {
    menu.open();
    menu.navigateDown();
    expect(menu.selectedIndex).toBe(1);
    menu.navigateDown();
    expect(menu.selectedIndex).toBe(2);
  });

  it('should wrap around when navigating past last option', () => {
    menu.open();
    menu.navigateDown();
    menu.navigateDown();
    menu.navigateDown();
    expect(menu.selectedIndex).toBe(0);
  });

  it('should navigate up through options', () => {
    menu.open();
    menu.navigateUp();
    expect(menu.selectedIndex).toBe(2); // wraps to bottom
  });

  it('should return selected option on confirm', () => {
    menu.open();
    expect(menu.confirm()).toBe('Resume');
    menu.navigateDown();
    expect(menu.confirm()).toBe('Restart Level');
    menu.navigateDown();
    expect(menu.confirm()).toBe('Quit to Title');
  });

  it('should reset selection when opened', () => {
    menu.open();
    menu.navigateDown();
    menu.navigateDown();
    menu.close();
    menu.open();
    expect(menu.selectedIndex).toBe(0);
  });

  it('should report paused state', () => {
    expect(menu.isPaused).toBe(false);
    menu.open();
    expect(menu.isPaused).toBe(true);
    menu.close();
    expect(menu.isPaused).toBe(false);
  });
});
