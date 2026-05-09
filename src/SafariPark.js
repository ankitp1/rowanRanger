import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { SAFARI_ANIMALS } from './animalsData';
import { getBadge, getNextBadge } from './badges';
import { speak } from './speak';
import SafariV1Grid from './SafariV1Grid';
import SafariV2Sticker from './SafariV2Sticker';
import SafariV3Cards from './SafariV3Cards';

const STORAGE_KEY = 'rowan-safari-seen-v2';
const VIEW_KEY    = 'rowan-safari-view';

const VIEWS = [
  { id: 'v1', label: 'Grid',     emoji: '🔭' },
  { id: 'v2', label: 'Stickers', emoji: '⭐' },
  { id: 'v3', label: 'Cards',    emoji: '🃏' },
];

// ─── Reset confirm modal ───────────────────────────────────────────────────
function ResetModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.6)' }}
    >
      <div className="bg-white rounded-[32px] p-8 w-full max-w-xs text-center shadow-2xl">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="safari-font text-2xl text-amber-900 mb-2">Reset Safari?</h2>
        <p className="text-sm font-bold text-slate-600 mb-6">
          This will clear all your spotted animals. Are you sure?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-slate-100 font-black text-slate-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-rose-500 font-black text-white text-sm"
          >
            Yes, Reset!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Badge celebration modal ───────────────────────────────────────────────
function BadgeCelebration({ badge, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[40px] p-10 w-full max-w-xs text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[80px] leading-none mb-4 animate-bounce">{badge.emoji}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-700 mb-2">New Badge!</p>
        <h2 className="safari-font text-4xl text-amber-900 mb-1">{badge.title}</h2>
        <p className="text-sm font-bold text-slate-600 mb-8">Amazing work, Rowan! 🎉</p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-amber-500 rounded-2xl text-white font-black text-lg uppercase tracking-wide"
        >
          Keep Exploring!
        </button>
      </div>
    </div>
  );
}

// ─── Main SafariPark container ─────────────────────────────────────────────
export default function SafariPark({ onBack }) {
  const [seen, setSeen] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const [view, setView] = useState(
    () => localStorage.getItem(VIEW_KEY) || 'v1'
  );
  const [showReset, setShowReset] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState(null);

  const prevCountRef = useRef(0);

  const spottedCount = Object.values(seen).filter(Boolean).length;
  const currentBadge = getBadge(spottedCount);
  const nextBadge    = getNextBadge(spottedCount);

  // Persist seen state
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seen)); } catch {}
  }, [seen]);

  // Persist view preference
  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch {}
  }, [view]);

  // Badge level-up detection & confetti
  useEffect(() => {
    const prevCount = prevCountRef.current;
    const prevBadge = getBadge(prevCount);

    if (spottedCount > prevCount && currentBadge.threshold > prevBadge.threshold) {
      confetti({
        particleCount: 220,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#f59e0b', '#f97316', '#fbbf24', '#fde68a', '#ffffff'],
      });
      speak(
        `Wow Rowan! You just earned the ${currentBadge.title} badge! ${
          nextBadge ? `Keep going! Just ${nextBadge.threshold - spottedCount} more for the ${nextBadge.title} badge!` : `You are a Legendary Ranger! Amazing job!`
        }`
      );
      setCelebrationBadge(currentBadge);
    }

    prevCountRef.current = spottedCount;
  }, [spottedCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Welcome message on first mount
  useEffect(() => {
    speak('Welcome to Safari Spotter! Tap an animal when you see it to mark it spotted!');
  }, []);

  const toggleSeen = useCallback((id, name) => {
    setSeen(prev => {
      const wasSpotted = Boolean(prev[id]);
      if (!wasSpotted) speak(`You spotted a ${name}! Great job Rowan!`);
      return { ...prev, [id]: !wasSpotted };
    });
  }, []);

  const handleReset = () => {
    setSeen({});
    prevCountRef.current = 0;
    speak('Safari progress reset! Ready for a brand new adventure!');
    setShowReset(false);
  };

  const sharedProps = {
    animals: SAFARI_ANIMALS,
    seen,
    onToggleSeen: toggleSeen,
    spottedCount,
    totalCount: SAFARI_ANIMALS.length,
    currentBadge,
    nextBadge,
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #fef3c7 0%, #fff8eb 40%, #fde68a20 100%)' }}>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-2 border-amber-200 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-2xl bg-amber-100 px-3 py-2.5 text-sm font-black text-amber-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.35em] text-amber-700 font-black">Safari Spotter</p>
          <h1 className="safari-font text-xl text-amber-900 leading-tight">Alabama Safari Park</h1>
        </div>

        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-1 rounded-2xl bg-rose-100 px-3 py-2.5 text-sm font-black text-rose-700 active:scale-95 transition-transform"
        >
          <RefreshCw size={15} /> Reset
        </button>
      </header>

      {/* View style switcher */}
      <div className="flex items-center justify-center gap-2 px-4 py-3">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-black transition-all ${
              view === v.id
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-white text-amber-800 border border-amber-200'
            }`}
          >
            <span>{v.emoji}</span> {v.label}
          </button>
        ))}
      </div>

      {/* Active view */}
      {view === 'v1' && <SafariV1Grid    {...sharedProps} />}
      {view === 'v2' && <SafariV2Sticker {...sharedProps} />}
      {view === 'v3' && <SafariV3Cards   {...sharedProps} />}

      {/* Modals */}
      {showReset       && <ResetModal badge={currentBadge} onConfirm={handleReset} onCancel={() => setShowReset(false)} />}
      {celebrationBadge && <BadgeCelebration badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />}
    </div>
  );
}
