import { Graphics } from 'pixi.js';
import { TILE_SIZE } from '../core/constants.js';
import { TileTypes } from '../systems/tile-map.js';
import { Theme } from '../core/theme.js';

const TILE_COLORS = {
  [TileTypes.PLATFORM]: Theme.platform,
  [TileTypes.SPIKE]: Theme.spike,
  [TileTypes.SPAWN]: Theme.spawn,
  [TileTypes.CHECKPOINT]: Theme.checkpoint,
  [TileTypes.EXIT]: Theme.exit,
};

export function renderTileMap(tileMap, container) {
  for (let row = 0; row < tileMap.height; row++) {
    for (let col = 0; col < tileMap.width; col++) {
      const type = tileMap.getTileAt(col, row);
      if (type === TileTypes.EMPTY) continue;

      const color = TILE_COLORS[type];
      if (!color) continue;

      const g = new Graphics();
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      if (type === TileTypes.PLATFORM) {
        // Solid block with lighter edge
        g.rect(x, y, TILE_SIZE, TILE_SIZE).fill(color);
        g.rect(x, y, TILE_SIZE, 1).fill(Theme.platformEdge);
        g.rect(x, y, 1, TILE_SIZE).fill(Theme.platformEdge);
      } else if (type === TileTypes.SPIKE) {
        // Triangle pointing up
        g.poly([
          x + TILE_SIZE / 2, y + 2,
          x + 2, y + TILE_SIZE,
          x + TILE_SIZE - 2, y + TILE_SIZE,
        ]).fill(color);
      } else if (type === TileTypes.CHECKPOINT) {
        // Small diamond
        const cx = x + TILE_SIZE / 2;
        const cy = y + TILE_SIZE / 2;
        g.poly([cx, cy - 5, cx + 4, cy, cx, cy + 5, cx - 4, cy]).fill(color);
      } else if (type === TileTypes.EXIT) {
        // Glowing rectangle
        g.rect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4).fill(color);
        g.rect(x, y, TILE_SIZE, TILE_SIZE).stroke({ width: 1, color: Theme.exitGlow });
      } else if (type === TileTypes.SPAWN) {
        // Small circle
        g.circle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 3).fill(color);
      }

      container.addChild(g);
    }
  }
}
