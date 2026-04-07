import { Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE } from '../core/constants.js';
import { Theme } from '../core/theme.js';
import { TileMap, TileTypes } from '../systems/tile-map.js';
import { PhysicsSystem } from '../systems/physics.js';
import { CollisionSystem } from '../systems/collision.js';
import { Camera } from '../systems/camera.js';
import { Player, JumpState } from '../entities/player.js';
import { ParticleEmitter } from '../systems/particles.js';
import { DeathRespawnSystem } from '../systems/death-respawn.js';
import { LevelCompleteDetector } from '../systems/level-complete.js';
import { HudState } from '../ui/hud.js';
import { PauseMenu } from '../ui/pause-menu.js';
import { HudRenderer } from '../rendering/hud-renderer.js';
import { MenuRenderer } from '../rendering/menu-renderer.js';
import { renderTileMap } from '../rendering/tile-renderer.js';
import { createPlayerGraphic, updatePlayerGraphic } from '../rendering/player-renderer.js';
import { createParticleGraphics, updateParticleGraphics } from '../rendering/particle-renderer.js';

export class GameScene {
  #engine = null;
  #sceneManager = null;
  #input = null;
  #audio = null;

  // Systems
  #tileMap = null;
  #physics = null;
  #collision = null;
  #camera = null;
  #player = null;
  #particles = null;
  #deathRespawn = null;
  #levelComplete = null;
  #hudState = null;
  #pauseMenu = null;

  // Rendering
  #worldContainer = null;
  #tileContainer = null;
  #playerGraphic = null;
  #particleGraphics = null;
  #hudRenderer = null;
  #pauseRenderer = null;

  constructor(engine, sceneManager, input, audio) {
    this.#engine = engine;
    this.#sceneManager = sceneManager;
    this.#input = input;
    this.#audio = audio;
  }

  init(data) {
    this.#worldContainer = new Container();
    this.#engine.worldContainer.addChild(this.#worldContainer);

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH * 3, GAME_HEIGHT * 3).fill(Theme.bg);
    bg.x = -GAME_WIDTH;
    bg.y = -GAME_HEIGHT;
    this.#worldContainer.addChild(bg);

    // Load level
    this.#tileMap = new TileMap();
    this.#tileMap.load(data.level);

    // Render tiles
    this.#tileContainer = new Container();
    this.#worldContainer.addChild(this.#tileContainer);
    renderTileMap(this.#tileMap, this.#tileContainer);

    // Systems
    this.#physics = new PhysicsSystem();
    this.#collision = new CollisionSystem(this.#tileMap);
    this.#camera = new Camera(this.#tileMap.worldWidth, this.#tileMap.worldHeight);
    this.#levelComplete = new LevelCompleteDetector(this.#tileMap);

    // Particles
    this.#particles = new ParticleEmitter(50);
    this.#particleGraphics = createParticleGraphics(this.#worldContainer, 50);

    // Death/respawn
    this.#deathRespawn = new DeathRespawnSystem((x, y) => {
      this.#particles.emit(x, y, 15);
      if (this.#audio) this.#audio.play('death');
    });

    // Find spawn point
    const spawn = this.#tileMap.findTile(TileTypes.SPAWN);
    if (spawn) {
      this.#deathRespawn.setSpawnPoint(spawn.col, spawn.row);
    }

    // Player
    this.#player = new Player(
      this.#deathRespawn.spawnX,
      this.#deathRespawn.spawnY,
    );
    this.#playerGraphic = createPlayerGraphic(this.#player);
    this.#worldContainer.addChild(this.#playerGraphic);

    // HUD
    this.#hudState = new HudState();
    this.#hudState.setLevelName(this.#tileMap.name);
    this.#hudRenderer = new HudRenderer();
    this.#engine.uiContainer.addChild(this.#hudRenderer.container);

    // Pause
    this.#pauseMenu = new PauseMenu();
    this.#pauseRenderer = new MenuRenderer('PAUSED', this.#pauseMenu.options);
    this.#pauseRenderer.container.visible = false;
    this.#engine.uiContainer.addChild(this.#pauseRenderer.container);
  }

  update(dt) {
    // Pause toggle
    if (this.#input.justPressed('pause')) {
      if (this.#pauseMenu.isPaused) {
        this.#pauseMenu.close();
        this.#pauseRenderer.container.visible = false;
        this.#hudState.paused = false;
      } else {
        this.#pauseMenu.open();
        this.#pauseRenderer.container.visible = true;
        this.#pauseRenderer.update(this.#pauseMenu.selectedIndex);
        this.#hudState.paused = true;
      }
    }

    // Pause menu navigation
    if (this.#pauseMenu.isPaused) {
      if (this.#input.justPressed('moveDown')) {
        this.#pauseMenu.navigateDown();
        this.#pauseRenderer.update(this.#pauseMenu.selectedIndex);
      }
      if (this.#input.justPressed('moveUp')) {
        this.#pauseMenu.navigateUp();
        this.#pauseRenderer.update(this.#pauseMenu.selectedIndex);
      }
      if (this.#input.justPressed('jump')) {
        const action = this.#pauseMenu.confirm();
        if (action === 'Resume') {
          this.#pauseMenu.close();
          this.#pauseRenderer.container.visible = false;
          this.#hudState.paused = false;
        } else if (action === 'Restart Level') {
          this.#sceneManager.switchTo('game', {
            level: { name: this.#tileMap.name, tiles: this.#getTiles() },
          });
        } else if (action === 'Quit to Title') {
          this.#sceneManager.switchTo('title');
        }
      }
      return;
    }

    // HUD timer
    this.#hudState.tick(dt);

    // Movement
    let dir = 0;
    if (this.#input.isDown('moveLeft')) dir -= 1;
    if (this.#input.isDown('moveRight')) dir += 1;
    this.#physics.applyMovement(this.#player, dir);

    // Jump
    if (this.#input.justPressed('jump')) {
      this.#physics.requestJump();
    }

    // Check grounded state change for coyote time
    const wasGrounded = this.#player.grounded;

    // Gravity
    this.#physics.applyGravity(this.#player);

    // Collision resolve (also moves entity by velocity)
    const result = this.#collision.resolve(this.#player);

    // Landing
    if (this.#player.grounded && !wasGrounded) {
      this.#player.land();
      if (this.#audio) this.#audio.play('landing');
    }

    // Left ground without jumping — start coyote time
    if (wasGrounded && !this.#player.grounded && this.#player.jumpState === JumpState.GROUNDED) {
      this.#physics.startCoyoteTime();
    }

    // Process jump buffer
    if (this.#physics.hasBufferedJump()) {
      if (this.#player.grounded || this.#physics.hasCoyoteTime()) {
        if (this.#player.jumpState === JumpState.GROUNDED) {
          this.#player.jump();
          this.#player.grounded = false;
          this.#physics.consumeJumpBuffer();
          this.#physics.consumeCoyoteTime();
          if (this.#audio) this.#audio.play('jump');
        }
      } else if (this.#player.canJump()) {
        this.#player.jump();
        this.#physics.consumeJumpBuffer();
        if (this.#audio) this.#audio.play('doubleJump');
      }
    }

    this.#physics.tickBuffers();

    // Checkpoint detection
    const checkpoints = this.#tileMap.findAllTiles(TileTypes.CHECKPOINT);
    for (const cp of checkpoints) {
      const cpX = cp.col * TILE_SIZE;
      const cpY = cp.row * TILE_SIZE;
      if (
        this.#player.x + this.#player.width > cpX &&
        this.#player.x < cpX + TILE_SIZE &&
        this.#player.y + this.#player.height > cpY &&
        this.#player.y < cpY + TILE_SIZE
      ) {
        this.#deathRespawn.touchCheckpoint(cp.col, cp.row);
      }
    }

    // Death checks
    if (result.hitSpike || result.hitKillPlane) {
      this.#deathRespawn.die(this.#player);
      this.#hudState.setDeathCount(this.#deathRespawn.deathCount);
    }

    // Level complete
    if (this.#levelComplete.check(this.#player)) {
      if (this.#audio) this.#audio.play('levelComplete');
      this.#sceneManager.switchTo('win', { levelName: this.#tileMap.name });
    }

    // Update particles
    this.#particles.update(dt);

    // Update rendering
    updatePlayerGraphic(this.#playerGraphic, this.#player);
    updateParticleGraphics(this.#particleGraphics, this.#particles.particles);
    this.#hudRenderer.update(this.#hudState);

    // Camera
    this.#camera.setTarget(
      this.#player.x + this.#player.width / 2,
      this.#player.y + this.#player.height / 2,
    );
    this.#camera.update();
    this.#worldContainer.x = this.#camera.offsetX;
    this.#worldContainer.y = this.#camera.offsetY;
  }

  #getTiles() {
    // Reconstruct tiles array for restart
    const tiles = [];
    for (let row = 0; row < this.#tileMap.height; row++) {
      const rowData = [];
      for (let col = 0; col < this.#tileMap.width; col++) {
        rowData.push(this.#tileMap.getTileAt(col, row));
      }
      tiles.push(rowData);
    }
    return tiles;
  }

  destroy() {
    if (this.#worldContainer) {
      this.#engine.worldContainer.removeChild(this.#worldContainer);
      this.#worldContainer.destroy({ children: true });
      this.#worldContainer = null;
    }
    if (this.#hudRenderer) {
      this.#engine.uiContainer.removeChild(this.#hudRenderer.container);
      this.#hudRenderer.container.destroy({ children: true });
      this.#hudRenderer = null;
    }
    if (this.#pauseRenderer) {
      this.#engine.uiContainer.removeChild(this.#pauseRenderer.container);
      this.#pauseRenderer.container.destroy({ children: true });
      this.#pauseRenderer = null;
    }
  }
}
