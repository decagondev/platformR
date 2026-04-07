export class SceneManager {
  #scenes = new Map();
  #current = null;

  get current() {
    return this.#current;
  }

  has(name) {
    return this.#scenes.has(name);
  }

  register(name, scene) {
    this.#scenes.set(name, scene);
  }

  switchTo(name, data) {
    if (!this.#scenes.has(name)) {
      throw new Error(`Scene "${name}" is not registered`);
    }

    if (this.#current) {
      this.#current.destroy();
    }

    this.#current = this.#scenes.get(name);
    this.#current.init(data);
  }

  update(dt) {
    if (this.#current) {
      this.#current.update(dt);
    }
  }
}
