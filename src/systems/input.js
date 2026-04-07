export const Actions = {
  MOVE_LEFT: 'moveLeft',
  MOVE_RIGHT: 'moveRight',
  JUMP: 'jump',
  PAUSE: 'pause',
};

const KEY_MAP = {
  ArrowLeft: Actions.MOVE_LEFT,
  a: Actions.MOVE_LEFT,
  ArrowRight: Actions.MOVE_RIGHT,
  d: Actions.MOVE_RIGHT,
  ' ': Actions.JUMP,
  ArrowUp: Actions.JUMP,
  w: Actions.JUMP,
  Escape: Actions.PAUSE,
};

export class InputSystem {
  #down = new Set();
  #justPressed = new Set();
  #onKeyDown = null;
  #onKeyUp = null;

  attach() {
    this.#onKeyDown = (e) => {
      const action = KEY_MAP[e.key];
      if (action) {
        e.preventDefault();
        if (!this.#down.has(action)) {
          this.#justPressed.add(action);
        }
        this.#down.add(action);
      }
    };

    this.#onKeyUp = (e) => {
      const action = KEY_MAP[e.key];
      if (action) {
        this.#down.delete(action);
      }
    };

    window.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('keyup', this.#onKeyUp);
  }

  detach() {
    if (this.#onKeyDown) {
      window.removeEventListener('keydown', this.#onKeyDown);
      window.removeEventListener('keyup', this.#onKeyUp);
      this.#onKeyDown = null;
      this.#onKeyUp = null;
    }
  }

  update() {
    this.#justPressed.clear();
  }

  isDown(action) {
    return this.#down.has(action);
  }

  isUp(action) {
    return !this.#down.has(action);
  }

  justPressed(action) {
    return this.#justPressed.has(action);
  }
}
