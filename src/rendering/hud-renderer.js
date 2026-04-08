import { Text, Container, Graphics } from 'pixi.js';
import { GAME_WIDTH } from '../core/constants.js';
import { Theme } from '../core/theme.js';

export class HudRenderer {
  container;
  #deathText;
  #levelText;
  #timerText;

  constructor() {
    this.container = new Container();

    // Semi-transparent bar at top
    const bar = new Graphics();
    bar.rect(0, 0, GAME_WIDTH, 12).fill({ color: Theme.uiOverlay, alpha: 0.5 });
    this.container.addChild(bar);

    const style = {
      fontFamily: Theme.fontFamily,
      fontSize: Theme.fontSizeSmall,
      fill: Theme.uiText,
    };

    this.#deathText = new Text({ text: 'Deaths: 0', style });
    this.#deathText.x = 4;
    this.#deathText.y = 2;
    this.container.addChild(this.#deathText);

    this.#levelText = new Text({ text: '', style });
    this.#levelText.anchor = { x: 0.5, y: 0 };
    this.#levelText.x = GAME_WIDTH / 2;
    this.#levelText.y = 2;
    this.container.addChild(this.#levelText);

    this.#timerText = new Text({ text: '00:00.00', style });
    this.#timerText.anchor = { x: 1, y: 0 };
    this.#timerText.x = GAME_WIDTH - 4;
    this.#timerText.y = 2;
    this.container.addChild(this.#timerText);
  }

  update(hudState) {
    this.#deathText.text = `Deaths: ${hudState.deathCount}`;
    this.#levelText.text = hudState.levelName;
    this.#timerText.text = hudState.formattedTime;
  }
}
