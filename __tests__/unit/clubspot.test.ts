import { assert, describe, it } from 'vitest';
import { Clubspot } from '../../src/clubspot.js';

describe('Clubspot', () => {
  // Assert if setTimeout was called properly
  it('constructor does not fail', () => {
    assert.doesNotThrow(() => {
      new Clubspot();
    });
  });
});
