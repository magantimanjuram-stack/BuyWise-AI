import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  label: string;
  sublabel?: string;
  isRisk?: boolean; // if true, lower score is better!
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, sublabel, isRisk = false }) => {
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score and whether it is risk
  let color = '#34d399'; // green
  if (isRisk) {
    if (score > 75) color = '#f87171'; // critical red
    else if (score > 50) color = '#fb923c'; // orange
    else if (score > 25) color = '#fbbf24'; // yellow
    else color = '#34d399'; // low risk green
  } else {
    if (score >= 85) color = '#34d399'; // green
    else if (score >= 70) color = '#38bdf8'; // blue
    else if (score >= 50) color = '#fbbf24'; // yellow
    else color = '#f87171'; // red
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size, marginBottom: '12px' }}>
        <svg width={size} height={size} className="score-gauge-ring">
          {/* Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="score-gauge-circle"
          />
        </svg>

        {/* Center Text */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            {score}
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-4px' }}>/ 100</span>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9', marginBottom: '2px' }}>
        {label}
      </div>

      {sublabel && (
        <span style={{
          fontSize: '0.75rem',
          color: isRisk && score <= 25 ? '#34d399' : '#94a3b8',
          fontWeight: 500
        }}>
          {isRisk ? `${sublabel} (Lower is Better)` : sublabel}
        </span>
      )}
    </div>
  );
};
