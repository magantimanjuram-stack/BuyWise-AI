import React, { useEffect, useState } from 'react';
import { Check, HelpCircle, Sparkles, Wand2 } from 'lucide-react';
import { CanonicalCategory, UserAnalysisRequest } from '../types/index.js';

interface AnalysisFormProps {
  category: CanonicalCategory;
  onAnalyze: (req: UserAnalysisRequest) => void;
  isLoading: boolean;
}

const MIN_BUDGETS: Record<CanonicalCategory, number> = {
  smartphone: 20000,
  laptop: 60000,
  tv: 60000,
  headphones: 15000,
  earbuds: 15000,
  smartwatch: 15000
};

const DEFAULT_BUDGETS: Record<CanonicalCategory, number> = {
  smartphone: 25000,
  laptop: 70000,
  tv: 70000,
  headphones: 20000,
  earbuds: 20000,
  smartwatch: 20000
};

const MAX_BUDGETS: Record<CanonicalCategory, number> = {
  smartphone: 150000,
  laptop: 200000,
  tv: 200000,
  headphones: 50000,
  earbuds: 40000,
  smartwatch: 80000
};

const PURPOSE_OPTIONS = [
  'General Use',
  'Coding',
  'AI Development',
  'Gaming',
  'Photography',
  'Work',
  'Study',
  'Entertainment',
  'Movies',
  'Music',
  'Calls',
  'Fitness',
  'Travel',
  'Battery Life',
  'Content Creation'
];

const SUGGESTED_PROMPTS: Record<CanonicalCategory, string[]> = {
  laptop: [
    '16GB RAM, 512GB storage, good processor, coding and AI development.',
    '16GB RAM, 1TB SSD, RTX 4060 GPU, 144Hz display for gaming and work.',
    'Lightweight ultraportable with OLED screen and 12-hour battery life.'
  ],
  smartphone: [
    '128GB storage, 5G, 120Hz display, flagship camera and long battery.',
    '16GB RAM, 256GB storage, fast 100W charging for heavy gaming.',
    'Best compact camera phone with official brand warranty.'
  ],
  tv: [
    'Need a 55-inch TV mainly for movies, Netflix Dolby Vision, and bright room.',
    '4K 120Hz refresh rate OLED TV for PlayStation 5 gaming.',
    '50-inch smart TV under budget with loud speakers and Google TV.'
  ],
  headphones: [
    'Top active noise cancelling (ANC), clear mic for office calls, 30hr battery.',
    'Audiophile wireless sound quality with LDAC support and plush comfort.',
    '60-hour marathon battery life and 2-year warranty for travel.'
  ],
  earbuds: [
    'Active noise cancellation (ANC), clear voice call quality, and compact fit.',
    'IP68 waterproof rating for gym workouts and running.',
    'Translucent aesthetic style with Hi-Res audio codec under 10k.'
  ],
  smartwatch: [
    'Multi-band GPS, AMOLED display, ECG health sensors, and 10+ day battery.',
    'Physical rotating bezel, Wear OS apps, and wrist phone calling.',
    'S9 chip with gesture control, crash detection, and aluminum build.'
  ]
};

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ category, onAnalyze, isLoading }) => {
  const minBudget = MIN_BUDGETS[category];
  const maxBudget = MAX_BUDGETS[category];

  const [budget, setBudget] = useState<number>(DEFAULT_BUDGETS[category]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(['Coding', 'Work']);
  const [requirementText, setRequirementText] = useState<string>(SUGGESTED_PROMPTS[category][0]);

  useEffect(() => {
    setBudget(DEFAULT_BUDGETS[category]);
    setRequirementText(SUGGESTED_PROMPTS[category][0]);
  }, [category]);

  const togglePurpose = (p: string) => {
    if (selectedPurposes.includes(p)) {
      setSelectedPurposes(selectedPurposes.filter((item) => item !== p));
    } else {
      setSelectedPurposes([...selectedPurposes, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      category,
      budget,
      purpose: selectedPurposes,
      requirementText
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '36px', marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Configure Decision Parameters</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Set your budget, primary purpose, and spec requirements below.</p>
        </div>
        <div style={{
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '6px 16px',
          borderRadius: '99px',
          color: '#38bdf8',
          fontWeight: 700,
          fontSize: '0.9rem',
          textTransform: 'capitalize'
        }}>
          {category} Mode
        </div>
      </div>

      {/* STEP 2: BUDGET SELECTION */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9' }}>
            Step 2: Set Maximum Budget
          </label>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
            ₹{budget.toLocaleString('en-IN')}
          </div>
        </div>

        <input
          type="range"
          min={minBudget}
          max={maxBudget}
          step={1000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            accentColor: '#06b6d4',
            cursor: 'pointer',
            marginBottom: '8px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
          <span>Min limit: ₹{minBudget.toLocaleString('en-IN')}</span>
          <span>Suggested: ₹{DEFAULT_BUDGETS[category].toLocaleString('en-IN')}</span>
          <span>Max: ₹{maxBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* STEP 3 & 4: PURPOSE SELECTION */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', display: 'block', marginBottom: '12px' }}>
          Step 3: Select Intended Purpose(s)
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PURPOSE_OPTIONS.map((p) => {
            const active = selectedPurposes.includes(p);
            return (
              <button
                type="button"
                key={p}
                onClick={() => togglePurpose(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  border: active ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: active ? '#ffffff' : '#94a3b8',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {active && <Check size={14} color="#38bdf8" />}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 5: NATURAL LANGUAGE REQUIREMENT INPUT */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f1f5f9', display: 'block', marginBottom: '8px' }}>
          Step 4: Tell BuyWise What You Need (Natural Language)
        </label>
        <textarea
          rows={3}
          value={requirementText}
          onChange={(e) => setRequirementText(e.target.value)}
          placeholder="e.g. 16GB RAM, 512GB storage, good processor, coding and AI development."
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(7, 9, 19, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f8fafc',
            fontSize: '1rem',
            fontFamily: 'var(--font-body)',
            resize: 'vertical',
            outline: 'none',
            marginBottom: '12px'
          }}
        />

        {/* Suggested Prompts */}
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <Sparkles size={12} color="#06b6d4" /> Click an example suggestion to populate:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SUGGESTED_PROMPTS[category].map((prompt, idx) => (
              <div
                key={idx}
                onClick={() => setRequirementText(prompt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                "{prompt}"
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 6: ANALYZE BUTTON */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
          style={{ padding: '16px 48px', fontSize: '1.15rem' }}
        >
          {isLoading ? (
            <>Evaluating Products...</>
          ) : (
            <>
              <Wand2 size={20} /> Analyze with BuyWise
            </>
          )}
        </button>
      </div>
    </form>
  );
};
