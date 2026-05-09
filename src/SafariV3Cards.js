import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useAnimalImage } from './useAnimalImage';
import { speak } from './speak';

// ─── Full-width animal card ────────────────────────────────────────────────
function BigCard({ animal, seen, animKey }) {
  const imgSrc = useAnimalImage(animal.wikiTitle);

  return (
    <div
      key={animKey}
      className="card-slide relative rounded-[36px] overflow-hidden shadow-2xl w-full"
      style={{ height: '52vh', minHeight: 260 }}
    >
      {/* Background image */}
      <div className="absolute inset-0 stripe-bg" />
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={animal.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[120px] leading-none">
          {animal.emoji}
        </div>
      )}

      {/* Dark scrim from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      {/* Spotted badge */}
      {seen && (
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-amber-500 rounded-full px-4 py-2 shadow-md">
          <span className="text-white font-black text-sm">✓ SPOTTED!</span>
        </div>
      )}

      {/* Name */}
      <div className="absolute bottom-5 left-6 right-6">
        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.38em] mb-1">You see…</p>
        <h2 className="safari-font text-5xl text-white drop-shadow-lg leading-tight">{animal.name}</h2>
      </div>
    </div>
  );
}

// ─── Fact strip below the card ─────────────────────────────────────────────
function FactStrip({ animal }) {
  const readAnimal = () => {
    speak(
      `${animal.name}! ${animal.origin} ${animal.peculiarity} Fun fact: ${animal.funFact} ${animal.sound}`
    );
  };

  return (
    <div className="bg-white rounded-[28px] p-4 shadow-md">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl leading-none flex-shrink-0 mt-0.5">⭐</span>
        <p className="text-sm font-bold text-slate-700 leading-relaxed">{animal.funFact}</p>
      </div>
      <div className="flex items-start gap-3 bg-amber-50 rounded-2xl p-3">
        <span className="text-xl leading-none flex-shrink-0 mt-0.5">🔊</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold italic text-amber-800 leading-relaxed">{animal.sound}</p>
        </div>
        <button
          onClick={readAnimal}
          className="ml-2 flex-shrink-0 bg-amber-500 rounded-xl p-2.5 text-white active:scale-90 transition-transform"
          aria-label="Read animal info"
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Dot-trail navigation indicator ───────────────────────────────────────
function DotTrail({ animals, idx, seen, onJump }) {
  // Show a sliding window of 9 dots centred on current index
  const half = 4;
  const start = Math.max(0, Math.min(idx - half, animals.length - 9));
  const end = Math.min(animals.length, start + 9);
  const dots = animals.slice(start, end);

  return (
    <div className="flex items-center justify-center gap-1.5">
      {dots.map((a, i) => {
        const realIdx = start + i;
        const isCurrent = realIdx === idx;
        const isSpotted = Boolean(seen[a.id]);
        return (
          <button
            key={a.id}
            onClick={() => onJump(realIdx)}
            className={`rounded-full transition-all duration-200 ${
              isCurrent
                ? 'w-6 h-4 bg-amber-500'
                : isSpotted
                ? 'w-3 h-3 bg-amber-300'
                : 'w-3 h-3 bg-amber-100 border border-amber-200'
            }`}
          />
        );
      })}
    </div>
  );
}

// ─── Main V3 Card Deck screen ──────────────────────────────────────────────
export default function SafariV3Cards({
  animals,
  seen,
  onToggleSeen,
  spottedCount,
  totalCount,
  currentBadge,
  nextBadge,
}) {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const animal = animals[idx];
  const pct = Math.round((spottedCount / totalCount) * 100);

  // Auto-read the animal name whenever the card changes
  useEffect(() => {
    speak(animal.name);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((newIdx) => {
    setIdx(newIdx);
    setAnimKey(k => k + 1);
  }, []);

  const prev = () => { if (idx > 0) goTo(idx - 1); };
  const next = () => { if (idx < animals.length - 1) goTo(idx + 1); };

  const isFirst = idx === 0;
  const isLast  = idx === animals.length - 1;

  return (
    <div className="px-4 pb-8 space-y-3">

      {/* Badge + progress bar */}
      <div className="flex items-center gap-3 bg-white rounded-[24px] px-4 py-3 shadow-md">
        <span className="text-3xl leading-none flex-shrink-0">{currentBadge.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-black text-amber-800 uppercase tracking-wide truncate">{currentBadge.title}</p>
            <p className="safari-font text-lg text-amber-900 ml-2 flex-shrink-0">
              {spottedCount}<span className="text-sm text-amber-500">/{totalCount}</span>
            </p>
          </div>
          <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          {nextBadge && (
            <p className="mt-1 text-[10px] font-bold text-amber-600">
              {nextBadge.threshold - spottedCount} more → {nextBadge.emoji} {nextBadge.title}
            </p>
          )}
        </div>
      </div>

      {/* Counter */}
      <p className="text-center safari-font text-sm text-amber-700">
        {idx + 1} of {animals.length}
      </p>

      {/* Big photo card */}
      <BigCard animal={animal} seen={Boolean(seen[animal.id])} animKey={animKey} />

      {/* Fact strip */}
      <FactStrip animal={animal} />

      {/* Primary action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onToggleSeen(animal.id, animal.name)}
          className={`py-5 rounded-[24px] font-black text-lg transition-all active:scale-95 ${
            seen[animal.id]
              ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
              : 'bg-amber-500 text-white shadow-lg shadow-amber-300/50'
          }`}
        >
          {seen[animal.id] ? '✓ Spotted!' : '🎉 I SAW IT!'}
        </button>
        <button
          onClick={next}
          disabled={isLast}
          className="py-5 rounded-[24px] bg-white border-2 border-amber-200 text-amber-800 font-black text-lg disabled:opacity-35 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          Next <ChevronRight size={22} />
        </button>
      </div>

      {/* Prev / dot-trail / next navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={prev}
          disabled={isFirst}
          className="flex items-center gap-1 bg-white border border-amber-200 rounded-2xl px-4 py-2.5 font-black text-amber-800 text-sm disabled:opacity-30 active:scale-95 transition-all"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <DotTrail animals={animals} idx={idx} seen={seen} onJump={goTo} />

        <button
          onClick={next}
          disabled={isLast}
          className="flex items-center gap-1 bg-white border border-amber-200 rounded-2xl px-4 py-2.5 font-black text-amber-800 text-sm disabled:opacity-30 active:scale-95 transition-all"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
