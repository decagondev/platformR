import { describe, it, expect } from 'vitest';
import { ObjectPool } from '../../src/utils/object-pool.js';

describe('ObjectPool', () => {
  function createItem() {
    return { x: 0, y: 0, active: false };
  }

  function resetItem(item) {
    item.x = 0;
    item.y = 0;
    item.active = false;
  }

  it('should acquire an item from the pool', () => {
    const pool = new ObjectPool(createItem, resetItem, 5);
    const item = pool.acquire();
    expect(item).toBeDefined();
    expect(item.x).toBe(0);
  });

  it('should return items to the pool for reuse', () => {
    const pool = new ObjectPool(createItem, resetItem, 2);
    const item1 = pool.acquire();
    item1.x = 99;
    pool.release(item1);

    const item2 = pool.acquire();
    expect(item2).toBe(item1);
    expect(item2.x).toBe(0);
  });

  it('should grow when pool is exhausted', () => {
    const pool = new ObjectPool(createItem, resetItem, 1);
    const item1 = pool.acquire();
    const item2 = pool.acquire();
    expect(item1).toBeDefined();
    expect(item2).toBeDefined();
    expect(item1).not.toBe(item2);
  });

  it('should report available count', () => {
    const pool = new ObjectPool(createItem, resetItem, 3);
    expect(pool.available).toBe(3);
    pool.acquire();
    expect(pool.available).toBe(2);
  });
});
