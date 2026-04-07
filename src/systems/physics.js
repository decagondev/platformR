export const PHYSICS_CONFIG = {
  gravity: 0.4,
  fallGravityMultiplier: 1.5,
  jumpForce: -6.5,
  doubleJumpForce: -5.5,
  moveSpeed: 2,
  airControlFactor: 0.75,
  maxFallSpeed: 8,
  jumpBufferFrames: 6,
  coyoteFrames: 5,
};

export class PhysicsSystem {
  #jumpBufferCounter = 0;
  #coyoteCounter = 0;

  applyGravity(entity) {
    const grav =
      entity.vy >= 0
        ? PHYSICS_CONFIG.gravity * PHYSICS_CONFIG.fallGravityMultiplier
        : PHYSICS_CONFIG.gravity;

    entity.vy += grav;

    if (entity.vy > PHYSICS_CONFIG.maxFallSpeed) {
      entity.vy = PHYSICS_CONFIG.maxFallSpeed;
    }
  }

  applyMovement(entity, direction) {
    const speed = entity.grounded
      ? PHYSICS_CONFIG.moveSpeed
      : PHYSICS_CONFIG.moveSpeed * PHYSICS_CONFIG.airControlFactor;

    entity.vx = direction * speed;
  }

  updatePosition(entity) {
    entity.x += entity.vx;
    entity.y += entity.vy;
  }

  requestJump() {
    this.#jumpBufferCounter = PHYSICS_CONFIG.jumpBufferFrames;
  }

  hasBufferedJump() {
    return this.#jumpBufferCounter > 0;
  }

  consumeJumpBuffer() {
    if (this.#jumpBufferCounter > 0) {
      this.#jumpBufferCounter = 0;
      return true;
    }
    return false;
  }

  startCoyoteTime() {
    this.#coyoteCounter = PHYSICS_CONFIG.coyoteFrames;
  }

  hasCoyoteTime() {
    return this.#coyoteCounter > 0;
  }

  consumeCoyoteTime() {
    if (this.#coyoteCounter > 0) {
      this.#coyoteCounter = 0;
      return true;
    }
    return false;
  }

  tickBuffers() {
    if (this.#jumpBufferCounter > 0) this.#jumpBufferCounter--;
    if (this.#coyoteCounter > 0) this.#coyoteCounter--;
  }
}
