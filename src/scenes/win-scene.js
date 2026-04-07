import { Text, Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';
import { Theme } from '../core/theme.js';
import { MenuNavigator } from '../ui/menu-navigator.js';

export class WinScene {
  #container = null;
  #engine = null;
  #sceneManager = null;
  #input = null;
  #levels = null;
  #nav = null;
  #optionTexts = [];
  #cursor = null;
  #levelName = '';

  constructor(engine, sceneManager, input, levels) {
    this.#engine = engine;
    this.#sceneManager = sceneManager;
    this.#input = input;
    this.#levels = levels;
  }

  init(data) {
    this.#levelName = data?.levelName || '';
    this.#container = new Container();
    this.#engine.uiContainer.addChild(this.#container);

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(Theme.bg);
    this.#container.addChild(bg);

    // "You Win" text
    const winText = new Text({
      text: 'YOU WIN',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeTitle,
        fill: Theme.exit,
      },
    });
    winText.anchor = { x: 0.5, y: 0 };
    winText.x = GAME_WIDTH / 2;
    winText.y = 30;
    this.#container.addChild(winText);

    // Level name
    if (this.#levelName) {
      const levelText = new Text({
        text: this.#levelName,
        style: {
          fontFamily: Theme.fontFamily,
          fontSize: Theme.fontSizeSmall,
          fill: Theme.uiTextDim,
        },
      });
      levelText.anchor = { x: 0.5, y: 0 };
      levelText.x = GAME_WIDTH / 2;
      levelText.y = 60;
      this.#container.addChild(levelText);
    }

    // Menu options
    this.#nav = new MenuNavigator(['Restart Level', 'Return to Title']);

    this.#cursor = new Text({
      text: '>',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeMedium,
        fill: Theme.uiHighlight,
      },
    });
    this.#container.addChild(this.#cursor);

    const startY = 90;
    const spacing = 18;
    for (let i = 0; i < this.#nav.options.length; i++) {
      const t = new Text({
        text: this.#nav.options[i],
        style: {
          fontFamily: Theme.fontFamily,
          fontSize: Theme.fontSizeMedium,
          fill: Theme.uiText,
        },
      });
      t.anchor = { x: 0.5, y: 0 };
      t.x = GAME_WIDTH / 2;
      t.y = startY + i * spacing;
      this.#container.addChild(t);
      this.#optionTexts.push(t);
    }
  }

  #updateCursor() {
    for (let i = 0; i < this.#optionTexts.length; i++) {
      const t = this.#optionTexts[i];
      if (i === this.#nav.selectedIndex) {
        t.style.fill = Theme.uiHighlight;
        this.#cursor.x = t.x - t.width / 2 - 12;
        this.#cursor.y = t.y;
      } else {
        t.style.fill = Theme.uiText;
      }
    }
  }

  update(_dt) {
    if (this.#input.justPressed('moveDown')) {
      this.#nav.down();
    }
    if (this.#input.justPressed('moveUp')) {
      this.#nav.up();
    }

    if (this.#input.justPressed('jump')) {
      const selected = this.#nav.confirm();
      if (selected === 'Restart Level') {
        // Find the level data again
        const level = this.#levels.find((l) => l.name === this.#levelName);
        if (level) {
          this.#sceneManager.switchTo('game', { level });
        }
      } else if (selected === 'Return to Title') {
        this.#sceneManager.switchTo('title');
      }
    }

    this.#updateCursor();
  }

  destroy() {
    if (this.#container) {
      this.#engine.uiContainer.removeChild(this.#container);
      this.#container.destroy({ children: true });
      this.#container = null;
    }
    this.#optionTexts = [];
  }
}
