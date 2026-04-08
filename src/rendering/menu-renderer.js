import { Text, Container, Graphics } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../core/constants.js';
import { Theme } from '../core/theme.js';

export class MenuRenderer {
  container;
  #titleText;
  #optionTexts = [];
  #cursor;

  constructor(title, options) {
    this.container = new Container();

    // Overlay background
    const overlay = new Graphics();
    overlay
      .rect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      .fill({ color: Theme.uiOverlay, alpha: Theme.uiOverlayAlpha });
    this.container.addChild(overlay);

    // Title
    this.#titleText = new Text({
      text: title,
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeLarge,
        fill: Theme.uiHighlight,
      },
    });
    this.#titleText.anchor = { x: 0.5, y: 0 };
    this.#titleText.x = GAME_WIDTH / 2;
    this.#titleText.y = 40;
    this.container.addChild(this.#titleText);

    // Cursor
    this.#cursor = new Text({
      text: '>',
      style: {
        fontFamily: Theme.fontFamily,
        fontSize: Theme.fontSizeMedium,
        fill: Theme.uiHighlight,
      },
    });
    this.container.addChild(this.#cursor);

    // Options
    const startY = 80;
    const spacing = 18;
    options.forEach((opt, i) => {
      const t = new Text({
        text: opt,
        style: {
          fontFamily: Theme.fontFamily,
          fontSize: Theme.fontSizeMedium,
          fill: Theme.uiText,
        },
      });
      t.anchor = { x: 0.5, y: 0 };
      t.x = GAME_WIDTH / 2;
      t.y = startY + i * spacing;
      this.container.addChild(t);
      this.#optionTexts.push(t);
    });
  }

  update(selectedIndex) {
    for (let i = 0; i < this.#optionTexts.length; i++) {
      const t = this.#optionTexts[i];
      if (i === selectedIndex) {
        t.style.fill = Theme.uiHighlight;
        this.#cursor.x = t.x - t.width / 2 - 12;
        this.#cursor.y = t.y;
      } else {
        t.style.fill = Theme.uiText;
      }
    }
  }
}
