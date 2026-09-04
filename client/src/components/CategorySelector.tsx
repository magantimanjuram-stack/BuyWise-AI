import React from 'react';
import { Headphones, Disc as EarbudsIcon, Laptop, Smartphone, Tv, Watch } from 'lucide-react';
import { CanonicalCategory } from '../types/index.js';

interface CategorySelectorProps {
  selectedCategory?: string;
  onSelectCategory: (category: CanonicalCategory) => void;
}

interface CategoryCardItem {
  id: CanonicalCategory;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    desc: 'Performance, camera, battery and value.',
    icon: <Smartphone size={32} />,
    color: '#06b6d4'
  },
  {
    id: 'laptop',
    name: 'Laptop',
    desc: 'Performance, RAM, storage and productivity.',
    icon: <Laptop size={32} />,
    color: '#3b82f6'
  },
  {
    id: 'tv',
    name: 'TV',
    desc: 'Picture quality, entertainment and gaming.',
    icon: <Tv size={32} />,
    color: '#8b5cf6'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    desc: 'Audio, ANC, comfort and calls.',
    icon: <Headphones size={32} />,
    color: '#10b981'
  },
  {
    id: 'earbuds',
    name: 'Earbuds',
    desc: 'Sound, ANC, calls and portability.',
    icon: <EarbudsIcon size={32} />,
    color: '#f59e0b'
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    desc: 'Fitness, sensors, battery and smart features.',
    icon: <Watch size={32} />,
    color: '#ec4899'
  }
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Step 1: Choose What You Want To Buy</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Select a category below to configure your budget and requirements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`glass-card category-card ${isSelected ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: isSelected ? `${cat.color}25` : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? cat.color : '#94a3b8',
                  transition: 'all 0.3s ease'
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '2px', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: isSelected ? cat.color : '#64748b', fontWeight: 600 }}>
                    {isSelected ? 'SELECTED' : 'CLICK TO SELECT'}
                  </span>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                {cat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
