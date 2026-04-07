import { PHYSICS_CONFIG } from '../systems/physics.js';

export const JumpState = {
  GROUNDED: 'grounded',
  JUMPED: 'jumped',
  DOUBLE_JUMPED: 'doubleJumped',
};

export class Player {
  x;
  y;
  vx = 0;
  vy = 0;
  width = 12;
  height = 14;
  grounded = false;
  jumpState = JumpState.GROUNDED;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  canJump() {
    return (
      this.jumpState === JumpState.GROUNDED ||
      this.jumpState === JumpState.JUMPED
    );
  }

  jump() {
    if (this.jumpState === JumpState.GROUNDED) {
      this.vy = PHYSICS_CONFIG.jumpForce;
      this.jumpState = JumpState.JUMPED;
    } else if (this.jumpState === JumpState.JUMPED) {
      this.vy = PHYSICS_CONFIG.doubleJumpForce;
      this.jumpState = JumpState.DOUBLE_JUMPED;
    }
  }

  land() {
    this.jumpState = JumpState.GROUNDED;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.jumpState = JumpState.GROUNDED;
  }
}
