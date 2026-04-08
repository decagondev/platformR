// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InputSystem, Actions } from '../../src/systems/input.js';

describe('InputSystem', () => {
  let input;

  beforeEach(() => {
    input = new InputSystem();
    input.attach();
  });

  afterEach(() => {
    input.detach();
  });

  function pressKey(key) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }

  function releaseKey(key) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key }));
  }

  it('should map ArrowLeft to moveLeft action', () => {
    pressKey('ArrowLeft');
    expect(input.isDown(Actions.MOVE_LEFT)).toBe(true);
  });

  it('should map "a" key to moveLeft action', () => {
    pressKey('a');
    expect(input.isDown(Actions.MOVE_LEFT)).toBe(true);
  });

  it('should map ArrowRight to moveRight action', () => {
    pressKey('ArrowRight');
    expect(input.isDown(Actions.MOVE_RIGHT)).toBe(true);
  });

  it('should map "d" key to moveRight action', () => {
    pressKey('d');
    expect(input.isDown(Actions.MOVE_RIGHT)).toBe(true);
  });

  it('should map ArrowUp to moveUp action', () => {
    pressKey('ArrowUp');
    expect(input.isDown(Actions.MOVE_UP)).toBe(true);
  });

  it('should map "w" key to moveUp action', () => {
    pressKey('w');
    expect(input.isDown(Actions.MOVE_UP)).toBe(true);
  });

  it('should map ArrowDown to moveDown action', () => {
    pressKey('ArrowDown');
    expect(input.isDown(Actions.MOVE_DOWN)).toBe(true);
  });

  it('should map "s" key to moveDown action', () => {
    pressKey('s');
    expect(input.isDown(Actions.MOVE_DOWN)).toBe(true);
  });

  it('should map Space to jump action', () => {
    pressKey(' ');
    expect(input.isDown(Actions.JUMP)).toBe(true);
  });

  it('should map Enter to jump action', () => {
    pressKey('Enter');
    expect(input.isDown(Actions.JUMP)).toBe(true);
  });

  it('should map Escape to pause action', () => {
    pressKey('Escape');
    expect(input.isDown(Actions.PAUSE)).toBe(true);
  });

  it('should report isUp when key is not pressed', () => {
    expect(input.isUp(Actions.JUMP)).toBe(true);
  });

  it('should report isUp after key is released', () => {
    pressKey(' ');
    releaseKey(' ');
    expect(input.isUp(Actions.JUMP)).toBe(true);
    expect(input.isDown(Actions.JUMP)).toBe(false);
  });

  it('should report justPressed on the frame the key is pressed', () => {
    pressKey(' ');
    expect(input.justPressed(Actions.JUMP)).toBe(true);
  });

  it('should reset justPressed after update', () => {
    pressKey(' ');
    expect(input.justPressed(Actions.JUMP)).toBe(true);
    input.update();
    expect(input.justPressed(Actions.JUMP)).toBe(false);
  });

  it('should still report isDown after justPressed resets', () => {
    pressKey(' ');
    input.update();
    expect(input.isDown(Actions.JUMP)).toBe(true);
    expect(input.justPressed(Actions.JUMP)).toBe(false);
  });

  it('should handle multiple actions simultaneously', () => {
    pressKey('ArrowLeft');
    pressKey(' ');
    expect(input.isDown(Actions.MOVE_LEFT)).toBe(true);
    expect(input.isDown(Actions.JUMP)).toBe(true);
  });

  it('should not report justPressed for held keys on subsequent frames', () => {
    pressKey(' ');
    input.update();
    // Key still held, but not "just" pressed
    expect(input.justPressed(Actions.JUMP)).toBe(false);
  });
});
