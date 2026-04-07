import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsSystem, PHYSICS_CONFIG } from '../../src/systems/physics.js';

function createEntity() {
  return {
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    grounded: false,
  };
}

describe('PhysicsSystem', () => {
  let physics;

  beforeEach(() => {
    physics = new PhysicsSystem();
  });

  it('should expose tunable config constants', () => {
    expect(PHYSICS_CONFIG.gravity).toBeDefined();
    expect(PHYSICS_CONFIG.jumpForce).toBeDefined();
    expect(PHYSICS_CONFIG.moveSpeed).toBeDefined();
    expect(PHYSICS_CONFIG.airControlFactor).toBeDefined();
    expect(PHYSICS_CONFIG.jumpBufferFrames).toBeDefined();
    expect(PHYSICS_CONFIG.coyoteFrames).toBeDefined();
  });

  it('should apply gravity to an entity each frame', () => {
    const entity = createEntity();
    physics.applyGravity(entity);
    expect(entity.vy).toBeGreaterThan(0);
  });

  it('should apply fall gravity faster than rise gravity', () => {
    const rising = createEntity();
    rising.vy = -5; // rising
    physics.applyGravity(rising);

    const falling = createEntity();
    falling.vy = 5; // falling
    physics.applyGravity(falling);

    // Fall gravity should add more than rise gravity
    const riseAccel = rising.vy - (-5);
    const fallAccel = falling.vy - 5;
    expect(fallAccel).toBeGreaterThan(riseAccel);
  });

  it('should reduce air control compared to ground control', () => {
    expect(PHYSICS_CONFIG.airControlFactor).toBeGreaterThan(0);
    expect(PHYSICS_CONFIG.airControlFactor).toBeLessThan(1);
  });

  it('should apply movement with full speed on ground', () => {
    const entity = createEntity();
    entity.grounded = true;
    physics.applyMovement(entity, 1); // moving right
    expect(entity.vx).toBe(PHYSICS_CONFIG.moveSpeed);
  });

  it('should apply movement with reduced speed in air', () => {
    const entity = createEntity();
    entity.grounded = false;
    physics.applyMovement(entity, 1); // moving right
    expect(entity.vx).toBe(
      PHYSICS_CONFIG.moveSpeed * PHYSICS_CONFIG.airControlFactor,
    );
  });

  it('should apply zero movement when direction is 0', () => {
    const entity = createEntity();
    physics.applyMovement(entity, 0);
    expect(entity.vx).toBe(0);
  });

  it('should track jump buffer state', () => {
    physics.requestJump();
    expect(physics.hasBufferedJump()).toBe(true);
  });

  it('should expire jump buffer after configured frames', () => {
    physics.requestJump();
    for (let i = 0; i <= PHYSICS_CONFIG.jumpBufferFrames; i++) {
      physics.tickBuffers();
    }
    expect(physics.hasBufferedJump()).toBe(false);
  });

  it('should track coyote time state', () => {
    physics.startCoyoteTime();
    expect(physics.hasCoyoteTime()).toBe(true);
  });

  it('should expire coyote time after configured frames', () => {
    physics.startCoyoteTime();
    for (let i = 0; i <= PHYSICS_CONFIG.coyoteFrames; i++) {
      physics.tickBuffers();
    }
    expect(physics.hasCoyoteTime()).toBe(false);
  });

  it('should consume jump buffer when used', () => {
    physics.requestJump();
    expect(physics.consumeJumpBuffer()).toBe(true);
    expect(physics.hasBufferedJump()).toBe(false);
  });

  it('should consume coyote time when used', () => {
    physics.startCoyoteTime();
    expect(physics.consumeCoyoteTime()).toBe(true);
    expect(physics.hasCoyoteTime()).toBe(false);
  });

  it('should update entity position based on velocity', () => {
    const entity = createEntity();
    entity.vx = 2;
    entity.vy = 3;
    physics.updatePosition(entity);
    expect(entity.x).toBe(102);
    expect(entity.y).toBe(103);
  });
});
