import { Text, Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';
import { Theme } from '../core/theme.js';
import { MenuNavigator } from '../ui/menu-navigator.js';

export class TitleScene {
  #container = null;
  #engine = null;
  #sceneManager = null;
  #input = null;
  #levels = [];
  #mode = 'main'; // 'main' or 'levelSelect'
  #mainNav = null;
  #levelNav = null;
  #optionTexts = [];
  #cursor = null;
  #titleText = null;

  constructor(engine, sceneManager, input, levels) {
    this.#engine = engine;
    this.#sceneManager = sceneManager;
    this.#input = input;
    this.#levels = levels;
  }

  init(_data) {
    this.#container = new Container();
    this.#engine.uiContainer.addChild(this.#container);

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, GAME_WIDTH, GAME_HEIGHT).fill(Theme.bg);
    this.#container.addChild(bg);

    // Title
    this.#titleText = new Text({
      text: 'NEON ASCENT',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeTitle,
        fill: Theme.uiHighlight,
      },
    });
    this.#titleText.anchor = { x: 0.5, y: 0 };
    this.#titleText.x = GAME_WIDTH / 2;
    this.#titleText.y = 30;
    this.#container.addChild(this.#titleText);

    // Subtitle
    const sub = new Text({
      text: 'A precision platformer',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeSmall,
        fill: Theme.uiTextDim,
      },
    });
    sub.anchor = { x: 0.5, y: 0 };
    sub.x = GAME_WIDTH / 2;
    sub.y = 60;
    this.#container.addChild(sub);

    this.#mainNav = new MenuNavigator(['Start Game', 'Level Select']);
    this.#levelNav = new MenuNavigator(
      this.#levels.map((l) => l.name),
    );

    this.#cursor = new Text({
      text: '>',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeMedium,
        fill: Theme.uiHighlight,
      },
    });
    this.#container.addChild(this.#cursor);

    this.#mode = 'main';
    this.#rebuildOptions();
  }

  #rebuildOptions() {
    // Remove old option texts
    for (const t of this.#optionTexts) {
      this.#container.removeChild(t);
    }
    this.#optionTexts = [];

    const nav = this.#mode === 'main' ? this.#mainNav : this.#levelNav;
    const startY = 90;
    const spacing = 18;

    for (let i = 0; i < nav.options.length; i++) {
      const t = new Text({
        text: nav.options[i],
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
    const nav = this.#mode === 'main' ? this.#mainNav : this.#levelNav;
    for (let i = 0; i < this.#optionTexts.length; i++) {
      const t = this.#optionTexts[i];
      if (i === nav.selectedIndex) {
        t.style.fill = Theme.uiHighlight;
        this.#cursor.x = t.x - t.width / 2 - 12;
        this.#cursor.y = t.y;
      } else {
        t.style.fill = Theme.uiText;
      }
    }
  }

  update(_dt) {
    const nav = this.#mode === 'main' ? this.#mainNav : this.#levelNav;

    if (this.#input.justPressed('moveDown')) {
      nav.down();
    }
    if (this.#input.justPressed('moveUp')) {
      nav.up();
    }

    if (this.#input.justPressed('jump')) {
      const selected = nav.confirm();
      if (this.#mode === 'main') {
        if (selected === 'Start Game') {
          this.#sceneManager.switchTo('game', { level: this.#levels[0] });
          return;
        } else if (selected === 'Level Select') {
          this.#mode = 'levelSelect';
          this.#levelNav.reset();
          this.#rebuildOptions();
        }
      } else {
        const levelIndex = nav.selectedIndex;
        this.#sceneManager.switchTo('game', {
          level: this.#levels[levelIndex],
        });
        return;
      }
    }

    if (this.#mode === 'levelSelect' && this.#input.justPressed('pause')) {
      this.#mode = 'main';
      this.#mainNav.reset();
      this.#rebuildOptions();
    }

    this.#updateCursor();
  }

  destroy() {
    if (this.#container) {
      this.#engine.uiContainer.removeChild(this.#container);
      this.#container.destroy({ children: true });
      this.#container = null;
    }
  }
}
