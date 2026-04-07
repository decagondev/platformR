import { describe, it, expect, beforeEach } from 'vitest';
import { Player, JumpState } from '../../src/entities/player.js';
import { PHYSICS_CONFIG } from '../../src/systems/physics.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player(50, 50);
  });

  it('should initialize with position and dimensions', () => {
    expect(player.x).toBe(50);
    expect(player.y).toBe(50);
    expect(player.width).toBeGreaterThan(0);
    expect(player.height).toBeGreaterThan(0);
  });

  it('should start in GROUNDED jump state', () => {
    player.grounded = true;
    expect(player.jumpState).toBe(JumpState.GROUNDED);
  });

  it('should transition to JUMPED on first jump', () => {
    player.grounded = true;
    player.jumpState = JumpState.GROUNDED;
    player.jump();
    expect(player.jumpState).toBe(JumpState.JUMPED);
    expect(player.vy).toBe(PHYSICS_CONFIG.jumpForce);
  });

  it('should transition to DOUBLE_JUMPED on second jump', () => {
    player.grounded = false;
    player.jumpState = JumpState.JUMPED;
    player.jump();
    expect(player.jumpState).toBe(JumpState.DOUBLE_JUMPED);
    expect(player.vy).toBe(PHYSICS_CONFIG.doubleJumpForce);
  });

  it('should not allow triple jump', () => {
    player.grounded = false;
    player.jumpState = JumpState.DOUBLE_JUMPED;
    const prevVy = player.vy;
    player.jump();
    expect(player.jumpState).toBe(JumpState.DOUBLE_JUMPED);
    expect(player.vy).toBe(prevVy);
  });

  it('should reset jump state on landing', () => {
    player.jumpState = JumpState.DOUBLE_JUMPED;
    player.land();
    expect(player.jumpState).toBe(JumpState.GROUNDED);
  });

  it('should allow first jump from GROUNDED state', () => {
    player.jumpState = JumpState.GROUNDED;
    expect(player.canJump()).toBe(true);
  });

  it('should allow double jump from JUMPED state', () => {
    player.jumpState = JumpState.JUMPED;
    expect(player.canJump()).toBe(true);
  });

  it('should not allow jump from DOUBLE_JUMPED state', () => {
    player.jumpState = JumpState.DOUBLE_JUMPED;
    expect(player.canJump()).toBe(false);
  });

  it('should reset velocity on respawn', () => {
    player.vx = 5;
    player.vy = -3;
    player.respawn(10, 20);
    expect(player.vx).toBe(0);
    expect(player.vy).toBe(0);
    expect(player.x).toBe(10);
    expect(player.y).toBe(20);
  });

  it('should reset jump state on respawn', () => {
    player.jumpState = JumpState.DOUBLE_JUMPED;
    player.respawn(10, 20);
    expect(player.jumpState).toBe(JumpState.GROUNDED);
  });
});
