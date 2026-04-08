import { Graphics } from 'pixi.js';
import { Theme } from '../core/theme.js';

export function createParticleGraphics(container, poolSize) {
  const graphics = [];
  for (let i = 0; i < poolSize; i++) {
    const g = new Graphics();
    g.rect(0, 0, 3, 3).fill(
      Theme.particleColors[i % Theme.particleColors.length],
    );
    g.visible = false;
    container.addChild(g);
    graphics.push(g);
  }
  return graphics;
}

export function updateParticleGraphics(graphics, particles) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (i < graphics.length) {
      const g = graphics[i];
      g.visible = p.active;
      if (p.active) {
        g.x = p.x;
        g.y = p.y;
        g.alpha = p.life / p.maxLife;
      }
    }
  }
}
