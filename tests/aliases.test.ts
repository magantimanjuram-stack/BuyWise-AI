import { describe, expect, it } from 'vitest';
import { normalizeCategory } from '../server/src/engine/category.js';

describe('Category Aliases Normalization', () => {
  it('normalizes smartphone aliases', () => {
    expect(normalizeCategory('phone')).toBe('smartphone');
    expect(normalizeCategory('mobile')).toBe('smartphone');
    expect(normalizeCategory('mobile phone')).toBe('smartphone');
    expect(normalizeCategory('smartphone')).toBe('smartphone');
  });

  it('normalizes laptop aliases', () => {
    expect(normalizeCategory('laptop')).toBe('laptop');
    expect(normalizeCategory('notebook')).toBe('laptop');
  });

  it('normalizes TV aliases', () => {
    expect(normalizeCategory('tv')).toBe('tv');
    expect(normalizeCategory('television')).toBe('tv');
    expect(normalizeCategory('smart tv')).toBe('tv');
  });

  it('normalizes headphones aliases', () => {
    expect(normalizeCategory('headphone')).toBe('headphones');
    expect(normalizeCategory('headphones')).toBe('headphones');
    expect(normalizeCategory('wireless headphones')).toBe('headphones');
  });

  it('normalizes earbuds aliases', () => {
    expect(normalizeCategory('earbud')).toBe('earbuds');
    expect(normalizeCategory('earbuds')).toBe('earbuds');
    expect(normalizeCategory('bluetooth')).toBe('earbuds');
    expect(normalizeCategory('bluetooth earbuds')).toBe('earbuds');
    expect(normalizeCategory('earbuds/bluetooth')).toBe('earbuds');
    expect(normalizeCategory('wireless earbuds')).toBe('earbuds');
  });

  it('normalizes smartwatch aliases', () => {
    expect(normalizeCategory('smartwatch')).toBe('smartwatch');
    expect(normalizeCategory('smart watch')).toBe('smartwatch');
    expect(normalizeCategory('watch')).toBe('smartwatch');
  });

  it('throws error for invalid category', () => {
    expect(() => normalizeCategory('refrigerator')).toThrow(/Unsupported category/);
  });
});
