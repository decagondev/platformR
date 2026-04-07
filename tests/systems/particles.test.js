import { describe, it, expect, beforeEach } from 'vitest';
import { ParticleEmitter } from '../../src/systems/particles.js';

describe('ParticleEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new ParticleEmitter(50);
  });

  it('should start with no active particles', () => {
    expect(emitter.activeCount).toBe(0);
  });

  it('should emit particles at a given position', () => {
    emitter.emit(100, 50, 10);
    expect(emitter.activeCount).toBe(10);
  });

  it('should update particle positions based on velocity and gravity', () => {
    emitter.emit(100, 50, 1);
    const particle = emitter.particles[0];
    const initialY = particle.y;

    // After enough frames, gravity should dominate and pull particle down
    for (let i = 0; i < 20; i++) {
      emitter.update(16.67);
    }
    expect(particle.y).toBeGreaterThan(initialY);
  });

  it('should decrease particle lifetime each update', () => {
    emitter.emit(100, 50, 1);
    const particle = emitter.particles[0];
    const initialLife = particle.life;

    emitter.update(16.67);
    expect(particle.life).toBeLessThan(initialLife);
  });

  it('should deactivate particles when lifetime expires', () => {
    emitter.emit(100, 50, 5);
    expect(emitter.activeCount).toBe(5);

    // Simulate enough time for particles to die (lifetime ~500ms)
    for (let i = 0; i < 40; i++) {
      emitter.update(16.67);
    }
    expect(emitter.activeCount).toBe(0);
  });

  it('should recycle particles via pool', () => {
    emitter.emit(100, 50, 5);
    // Let them all expire
    for (let i = 0; i < 40; i++) {
      emitter.update(16.67);
    }
    expect(emitter.activeCount).toBe(0);

    // Emit again — should reuse pool
    emitter.emit(200, 100, 5);
    expect(emitter.activeCount).toBe(5);
  });

  it('should emit particles with random velocities', () => {
    emitter.emit(100, 50, 10);
    const velocities = emitter.particles
      .filter((p) => p.active)
      .map((p) => p.vx);
    const unique = new Set(velocities);
    // With 10 particles, we expect at least some variation
    expect(unique.size).toBeGreaterThan(1);
  });
});
