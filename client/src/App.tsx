import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage.js';
import { LoadingState } from './components/LoadingState.js';
import { Navbar } from './components/Navbar.js';
import { ResultsView } from './components/ResultsView.js';
import { analyzeBuyWise } from './services/api.js';
import { BuyWiseAnalysisResponse, CanonicalCategory, UserAnalysisRequest } from './types/index.js';

export function App() {
  const [view, setView] = useState<'HOME' | 'LOADING' | 'RESULTS'>('HOME');
  const [category, setCategory] = useState<CanonicalCategory>('laptop');
  const [analysisResult, setAnalysisResult] = useState<BuyWiseAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectCategory = (cat: CanonicalCategory) => {
    setCategory(cat);
  };

  const handleAnalyze = async (req: UserAnalysisRequest) => {
    try {
      setView('LOADING');
      setErrorMessage(null);
      const result = await analyzeBuyWise(req);
      setAnalysisResult(result);
      setView('RESULTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to complete BuyWise evaluation');
      setView('HOME');
    }
  };

  const handleReset = () => {
    setView('HOME');
    setAnalysisResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onReset={handleReset} activeCategory={category} />

      <main style={{ flex: 1 }}>
        {errorMessage && (
          <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 24px' }}>
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#f87171',
              padding: '14px 20px',
              borderRadius: '12px',
              fontSize: '0.95rem'
            }}>
              <strong>Error:</strong> {errorMessage}
            </div>
          </div>
        )}

        {view === 'HOME' && (
          <LandingPage
            category={category}
            onSelectCategory={handleSelectCategory}
            onAnalyze={handleAnalyze}
            isLoading={false}
          />
        )}

        {view === 'LOADING' && (
          <LoadingState />
        )}

        {view === 'RESULTS' && analysisResult && (
          <ResultsView analysis={analysisResult} onNewSearch={() => setView('HOME')} />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '30px 24px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          BuyWise AI Commerce Decision Agent — "Make smarter purchases, not cheaper ones."
          <br />
          Built with React, TypeScript, Express, and Razorpay Test Mode integration.
        </div>
      </footer>
    </div>
  );
}
