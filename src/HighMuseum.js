import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw, Volume2, Info, CheckCircle2 } from 'lucide-react';
import { MUSEUM_ITEMS } from './museumData';
import { useAnimalImage } from './useAnimalImage';
import { speak } from './speak';

const STORAGE_KEY = 'rowan-museum-found';

const BADGES = [
  { threshold: 0,  title: 'Gallery Visitor',  emoji: '🗺️', bg: '#e2e8f0', text: '#475569' },
  { threshold: 1,  title: 'Art Spotter',       emoji: '👀', bg: '#fef3c7', text: '#92400e' },
  { threshold: 3,  title: 'Museum Explorer',   emoji: '🎨', bg: '#fce7f3', text: '#9d174d' },
  { threshold: 6,  title: 'Art Ranger',         emoji: '⭐', bg: '#d1fae5', text: '#065f46' },
  { threshold: 9,  title: 'Museum Champion',   emoji: '🏛️', bg: '#ede9fe', text: '#5b21b6' },
  { threshold: 11, title: 'Master Curator',    emoji: '🏆', bg: '#fef9c3', text: '#713f12' },
];

function getBadge(count) {
  let b = BADGES[0];
  for (const badge of BADGES) { if (count >= badge.threshold) b = badge; }
  return b;
}
function getNextBadge(count) {
  return BADGES.find(b => b.threshold > count) || null;
}

// ─── Reset modal ────────────────────────────────────────────────────────────
function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white rounded-[32px] p-8 w-full max-w-xs text-center shadow-2xl">
        <div className="text-6xl mb-4">🔄</div>
        <h2 className="safari-font text-2xl mb-2" style={{ color: '#7c2d12' }}>Reset Museum Hunt?</h2>
        <p className="text-sm font-bold text-slate-600 mb-6">This will clear all your found artworks.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl bg-slate-100 font-black text-slate-700 text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl bg-rose-500 font-black text-white text-sm">Yes, Reset!</button>
        </div>
      </div>
    </div>
  );
}

// ─── Badge celebration ───────────────────────────────────────────────────────
function BadgeCelebration({ badge, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="bg-white rounded-[40px] p-10 w-full max-w-xs text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-[80px] leading-none mb-4 animate-bounce">{badge.emoji}</div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: '#92400e' }}>New Badge!</p>
        <h2 className="safari-font text-4xl mb-1" style={{ color: '#7c2d12' }}>{badge.title}</h2>
        <p className="text-sm font-bold text-slate-600 mb-8">Amazing eye, Rowan! 🎨</p>
        <button onClick={onClose} className="w-full py-4 rounded-2xl text-white font-black text-lg uppercase tracking-wide" style={{ background: '#7c2d12' }}>
          Keep Exploring!
        </button>
      </div>
    </div>
  );
}

// ─── Info modal ──────────────────────────────────────────────────────────────
function InfoModal({ item, onClose }) {
  const wikiImg = useAnimalImage(item.directImg ? null : item.wikiTitle);
  const imgSrc = item.directImg || wikiImg;

  const readAll = () => {
    speak(`${item.name} by ${item.artist}. ${item.about} ${item.whyCool} Fun fact: ${item.funFact}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-[36px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-52 stripe-bg">
          {imgSrc ? (
            <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[80px]">{item.emoji}</div>
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(124,45,18,0.85) 0%, transparent 55%)' }} />
          <div className="absolute bottom-4 left-5 right-14">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">{item.artist}</p>
            <h2 className="safari-font text-2xl text-white leading-tight">{item.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-black"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >×</button>
        </div>

        {/* Where to find it */}
        <div className="px-5 pt-3 pb-1">
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2 w-fit" style={{ background: '#fef3c7' }}>
            <span className="text-base">📍</span>
            <p className="text-xs font-black text-amber-800">{item.where}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-2 space-y-3">
          {/* Hunt clue */}
          <div className="rounded-2xl p-3 flex items-start gap-3" style={{ background: '#fdf4e7', border: '2px solid #f59e0b' }}>
            <span className="text-xl leading-none mt-0.5">🔍</span>
            <p className="text-sm font-black" style={{ color: '#92400e' }}>{item.huntClue}</p>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">🖼️</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.about}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">✨</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.whyCool}</p>
          </div>
          <div className="rounded-2xl p-3 flex items-start gap-3" style={{ background: '#f0fdf4' }}>
            <span className="text-xl leading-none mt-0.5">⭐</span>
            <p className="text-sm font-bold leading-relaxed" style={{ color: '#14532d' }}>{item.funFact}</p>
          </div>

          <button
            onClick={readAll}
            className="w-full py-4 rounded-2xl text-white font-black text-base uppercase tracking-wide flex items-center justify-center gap-2"
            style={{ background: '#7c2d12' }}
          >
            <Volume2 size={20} /> Read to Me!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Single artwork hunt card ────────────────────────────────────────────────
function HuntCard({ item, found, onToggle, onInfo }) {
  const wikiImg = useAnimalImage(item.directImg ? null : item.wikiTitle);
  const imgSrc = item.directImg || wikiImg;

  return (
    <div
      className={`rounded-[28px] overflow-hidden bg-white shadow-md flex flex-col transition-all duration-200 ${
        found ? 'ring-4 shadow-amber-200/60' : 'ring-2 ring-amber-100'
      }`}
      style={found ? { ringColor: '#d97706' } : {}}
    >
      {/* Image — tap to mark found */}
      <button onClick={onToggle} className="relative block w-full flex-shrink-0" style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0 stripe-bg" />
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[64px] leading-none">
            {item.emoji}
          </div>
        )}

        {/* Found badge */}
        {found && (
          <div className="absolute inset-0 flex items-start p-2.5" style={{ background: 'rgba(217,119,6,0.15)' }}>
            <div className="flex items-center gap-1 rounded-full px-3 py-1 shadow-md" style={{ background: '#d97706' }}>
              <CheckCircle2 size={12} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Found!</span>
            </div>
          </div>
        )}
      </button>

      {/* Hunt clue */}
      <div className="px-3 pt-2.5 pb-1">
        <div className="rounded-xl p-2 flex items-start gap-2" style={{ background: '#fef3c7' }}>
          <span className="text-base leading-none flex-shrink-0 mt-0.5">🔍</span>
          <p className="text-[11px] font-black leading-snug" style={{ color: '#92400e' }}>{item.huntClue}</p>
        </div>
      </div>

      {/* Name + buttons */}
      <div className="flex items-center justify-between gap-2 px-3 pt-2 pb-1">
        <div className="flex-1 min-w-0">
          <p className="safari-font text-[15px] leading-tight truncate" style={{ color: '#7c2d12' }}>{item.name}</p>
          <p className="text-[10px] font-bold text-slate-500 truncate">{item.artist}</p>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => speak(item.huntClue + ' ' + item.funFact)}
            className="rounded-full p-2 active:scale-90 transition-transform"
            style={{ background: '#fef3c7', color: '#92400e' }}
            aria-label="Hear clue"
          >
            <Volume2 size={15} />
          </button>
          <button
            onClick={onInfo}
            className="rounded-full p-2 text-white active:scale-90 transition-transform"
            style={{ background: '#7c2d12' }}
            aria-label="More info"
          >
            <Info size={15} />
          </button>
        </div>
      </div>

      {/* "I FOUND IT!" button */}
      <button
        onClick={onToggle}
        className="w-full py-3 mt-1 font-black text-xs uppercase tracking-widest transition-colors"
        style={found
          ? { background: '#d97706', color: '#fff' }
          : { background: '#fef9f0', color: '#92400e', borderTop: '1px solid #fde68a' }
        }
      >
        {found ? '✓ I Found It!' : 'Tap when you find it!'}
      </button>
    </div>
  );
}

// ─── Progress + badge bar ───────────────────────────────────────────────────
function ProgressHeader({ foundCount, totalCount, currentBadge, nextBadge }) {
  const pct = Math.round((foundCount / totalCount) * 100);
  return (
    <div className="mx-4 mb-4 bg-white rounded-[28px] p-5 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{currentBadge.emoji}</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: '#92400e' }}>Badge</p>
            <p className="safari-font text-xl leading-tight" style={{ color: '#7c2d12' }}>{currentBadge.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="safari-font text-4xl leading-none" style={{ color: '#7c2d12' }}>
            {foundCount}<span className="text-xl" style={{ color: '#b45309' }}>/{totalCount}</span>
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#b45309' }}>found</p>
        </div>
      </div>
      <div className="h-5 rounded-full overflow-hidden" style={{ background: '#fde68a' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #d97706, #b45309)' }}
        />
      </div>
      {nextBadge && (
        <p className="mt-2 text-xs font-bold" style={{ color: '#92400e' }}>
          {nextBadge.threshold - foundCount} more to unlock {nextBadge.emoji} {nextBadge.title}!
        </p>
      )}
    </div>
  );
}

// ─── Main HighMuseum screen ──────────────────────────────────────────────────
export default function HighMuseum({ onBack }) {
  const [found, setFound] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const [activeItem, setActiveItem] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [celebrationBadge, setCelebrationBadge] = useState(null);
  const prevCountRef = useRef(0);

  const foundCount   = Object.values(found).filter(Boolean).length;
  const currentBadge = getBadge(foundCount);
  const nextBadge    = getNextBadge(foundCount);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(found)); } catch {}
    const prevBadge = getBadge(prevCountRef.current);
    if (foundCount > prevCountRef.current && currentBadge.threshold > prevBadge.threshold) {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.45 }, colors: ['#d97706', '#b45309', '#fbbf24', '#fde68a', '#fff'] });
      speak(`Amazing Rowan! You earned the ${currentBadge.title} badge! Keep looking!`);
      setCelebrationBadge(currentBadge);
    }
    prevCountRef.current = foundCount;
  }, [found]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    speak('Welcome to the High Museum of Art! Use the clues on each card to find the artwork. Tap it when you spot it!');
  }, []);

  const toggleFound = useCallback((id, name) => {
    setFound(prev => {
      const wasDone = Boolean(prev[id]);
      if (!wasDone) speak(`You found ${name}! Awesome eye, Rowan!`);
      return { ...prev, [id]: !wasDone };
    });
  }, []);

  const handleReset = () => {
    setFound({});
    prevCountRef.current = 0;
    speak('Hunt reset! Let\'s find them all again!');
    setShowReset(false);
  };

  const openInfo = (item) => {
    setActiveItem(item);
    speak(`${item.name} by ${item.artist}. ${item.huntClue}`);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #fef9f0 0%, #fff8eb 50%, #fef3c730 100%)' }}>

      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-sm border-b-2 px-4 py-3 flex items-center justify-between gap-3"
        style={{ background: 'rgba(255,252,245,0.96)', borderColor: '#fde68a' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-2xl px-3 py-2.5 text-sm font-black active:scale-95 transition-transform"
          style={{ background: '#fef3c7', color: '#92400e' }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.35em] font-black" style={{ color: '#b45309' }}>Art Scavenger Hunt</p>
          <h1 className="safari-font text-xl leading-tight" style={{ color: '#7c2d12' }}>High Museum of Art</h1>
        </div>

        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-1 rounded-2xl bg-rose-100 px-3 py-2.5 text-sm font-black text-rose-700 active:scale-95 transition-transform"
        >
          <RefreshCw size={15} /> Reset
        </button>
      </header>

      {/* Intro strip */}
      <div className="px-4 py-3 flex items-center gap-3 mx-4 mt-4 mb-2 rounded-[24px]" style={{ background: '#7c2d12' }}>
        <span className="text-3xl leading-none">🏛️</span>
        <div>
          <p className="safari-font text-lg text-white leading-tight">High Museum of Art</p>
          <p className="text-xs font-bold text-white/75">Read each clue and find the artwork! Tap it when you spot it!</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <ProgressHeader
          foundCount={foundCount}
          totalCount={MUSEUM_ITEMS.length}
          currentBadge={currentBadge}
          nextBadge={nextBadge}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-8">
        {MUSEUM_ITEMS.map(item => (
          <HuntCard
            key={item.id}
            item={item}
            found={Boolean(found[item.id])}
            onToggle={() => toggleFound(item.id, item.name)}
            onInfo={() => openInfo(item)}
          />
        ))}
      </div>

      {/* Modals */}
      {activeItem && <InfoModal item={activeItem} onClose={() => setActiveItem(null)} />}
      {showReset   && <ResetModal onConfirm={handleReset} onCancel={() => setShowReset(false)} />}
      {celebrationBadge && <BadgeCelebration badge={celebrationBadge} onClose={() => setCelebrationBadge(null)} />}
    </div>
  );
}
