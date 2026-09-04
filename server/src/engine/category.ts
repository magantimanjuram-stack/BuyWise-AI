import { CanonicalCategory } from '../types/index.js';

const ALIAS_MAP: Record<string, CanonicalCategory> = {
  // Smartphone aliases
  phone: 'smartphone',
  mobile: 'smartphone',
  'mobile phone': 'smartphone',
  smartphone: 'smartphone',

  // Laptop aliases
  laptop: 'laptop',
  notebook: 'laptop',

  // TV aliases
  tv: 'tv',
  television: 'tv',
  'smart tv': 'tv',

  // Headphones aliases
  headphone: 'headphones',
  headphones: 'headphones',
  'wireless headphones': 'headphones',

  // Earbuds aliases
  earbud: 'earbuds',
  earbuds: 'earbuds',
  bluetooth: 'earbuds',
  'bluetooth earbuds': 'earbuds',
  'earbuds/bluetooth': 'earbuds',
  'wireless earbuds': 'earbuds',

  // Smartwatch aliases
  smartwatch: 'smartwatch',
  'smart watch': 'smartwatch',
  watch: 'smartwatch'
};

export function normalizeCategory(input: string): CanonicalCategory {
  if (!input) {
    throw new Error('Category input cannot be empty.');
  }

  const cleaned = input.trim().toLowerCase();
  const canonical = ALIAS_MAP[cleaned];

  if (!canonical) {
    throw new Error(`Unsupported category: "${input}". Supported categories are Smartphone, Laptop, TV, Headphones, Earbuds, Smartwatch.`);
  }

  return canonical;
}
