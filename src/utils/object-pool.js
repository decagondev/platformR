export class ObjectPool {
  #pool;
  #create;
  #reset;

  constructor(createFn, resetFn, initialSize = 10) {
    this.#create = createFn;
    this.#reset = resetFn;
    this.#pool = [];

    for (let i = 0; i < initialSize; i++) {
      this.#pool.push(this.#create());
    }
  }

  get available() {
    return this.#pool.length;
  }

  acquire() {
    if (this.#pool.length === 0) {
      this.#pool.push(this.#create());
    }
    return this.#pool.pop();
  }

  release(item) {
    this.#reset(item);
    this.#pool.push(item);
  }
}
