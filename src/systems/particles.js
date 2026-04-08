const GRAVITY = 0.3;
const DEFAULT_LIFETIME = 500; // ms

function createParticle() {
  return {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 0,
    active: false,
  };
}

export class ParticleEmitter {
  particles = [];

  constructor(poolSize = 50) {
    for (let i = 0; i < poolSize; i++) {
      this.particles.push(createParticle());
    }
  }

  get activeCount() {
    let count = 0;
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].active) count++;
    }
    return count;
  }

  emit(x, y, count) {
    let emitted = 0;
    for (let i = 0; i < this.particles.length && emitted < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.x = x;
        p.y = y;
        p.vx = (Math.random() - 0.5) * 6;
        p.vy = (Math.random() - 1) * 4;
        p.life = DEFAULT_LIFETIME;
        p.maxLife = DEFAULT_LIFETIME;
        p.active = true;
        emitted++;
      }
    }

    // Grow pool if needed
    while (emitted < count) {
      const p = createParticle();
      p.x = x;
      p.y = y;
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 1) * 4;
      p.life = DEFAULT_LIFETIME;
      p.maxLife = DEFAULT_LIFETIME;
      p.active = true;
      this.particles.push(p);
      emitted++;
    }
  }

  update(dt) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.vy += GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
    }
  }
}
