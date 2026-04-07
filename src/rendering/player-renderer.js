import { Graphics } from 'pixi.js';
import { Theme } from '../core/theme.js';

export function createPlayerGraphic(player) {
  const g = new Graphics();
  drawPlayer(g, player);
  return g;
}

export function updatePlayerGraphic(graphic, player) {
  graphic.x = player.x;
  graphic.y = player.y;
}

function drawPlayer(g, player) {
  const w = player.width;
  const h = player.height;

  // Body
  g.rect(1, 0, w - 2, h).fill(Theme.player);

  // Eyes (two small bright rectangles)
  g.rect(3, 3, 2, 2).fill(Theme.uiTextBright);
  g.rect(w - 5, 3, 2, 2).fill(Theme.uiTextBright);

  // Antenna
  g.rect(w / 2 - 0.5, -2, 1, 3).fill(Theme.playerGlow);

  // Leg detail
  g.rect(2, h - 3, 3, 3).fill(Theme.playerGlow);
  g.rect(w - 5, h - 3, 3, 3).fill(Theme.playerGlow);
}
