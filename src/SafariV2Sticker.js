import React, { useState } from 'react';
import { Volume2, Info } from 'lucide-react';
import { useAnimalImage } from './useAnimalImage';
import { speak } from './speak';

// ─── Info modal (shared with V2) ───────────────────────────────────────────
function InfoModal({ animal, onClose }) {
  const imgSrc = useAnimalImage(animal.wikiTitle);

  const readAll = () => {
    speak(`${animal.name}. ${animal.origin} ${animal.peculiarity} Fun fact: ${animal.funFact} ${animal.sound}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-[36px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-52 stripe-bg">
          {imgSrc ? (
            <img src={imgSrc} alt={animal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[80px]">{animal.emoji}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5">
            <h2 className="safari-font text-3xl text-white leading-tight">{animal.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white text-xl font-black"
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-3 items-start">
            <span className="text-xl">🌍</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{animal.origin}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-xl">✨</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{animal.peculiarity}</p>
          </div>
          <div className="flex gap-3 items-start bg-amber-50 rounded-2xl p-3">
            <span className="text-xl">⭐</span>
            <p className="text-sm font-bold text-amber-900 leading-relaxed">{animal.funFact}</p>
          </div>
          <div className="flex gap-3 items-start bg-slate-50 rounded-2xl p-3">
            <span className="text-xl">🔊</span>
            <p className="text-sm font-bold italic text-slate-600 leading-relaxed">{animal.sound}</p>
          </div>
          <button
            onClick={readAll}
            className="w-full py-4 bg-amber-500 rounded-2xl text-white font-black uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <Volume2 size={20} /> Read to Me!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Individual sticker slot ───────────────────────────────────────────────
function StickerSlot({ animal, seen, onToggle, onInfo }) {
  const imgSrc = useAnimalImage(animal.wikiTitle);
  const [wasJustSpotted, setWasJustSpotted] = useState(false);

  const handleTap = () => {
    if (!seen) {
      setWasJustSpotted(true);
      setTimeout(() => setWasJustSpotted(false), 500);
    }
    onToggle();
  };

  return (
    <div className="relative flex flex-col" style={{ aspectRatio: '3/4' }}>
      <button
        onClick={handleTap}
        className={`relative w-full h-full rounded-[22px] overflow-hidden transition-all duration-300 ${
          seen
            ? `shadow-lg ring-2 ring-amber-300 ${wasJustSpotted ? 'sticker-in' : ''}`
            : 'opacity-75 shadow-sm'
        }`}
      >
        {seen ? (
          /* ── Revealed sticker ── */
          <div className="w-full h-full flex flex-col bg-white">
            <div className="relative flex-1 stripe-bg overflow-hidden rounded-t-[20px]">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {animal.emoji}
                </div>
              )}
              {/* Gold star badge */}
              <div className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-sm font-black shadow">
                ✓
              </div>
            </div>
            <div className="px-2 py-1.5 text-center">
              <p className="safari-font text-[13px] text-amber-900 leading-tight truncate">{animal.name}</p>
              <p className="text-amber-500 text-[10px] font-black">⭐ Got it!</p>
            </div>
          </div>
        ) : (
          /* ── Mystery slot ── */
          <div className="w-full h-full bg-gradient-to-br from-stone-700 to-stone-900 flex flex-col items-center justify-center gap-1 p-2 rounded-[22px]">
            <div
              className="text-5xl leading-none opacity-20"
              style={{ filter: 'grayscale(100%) brightness(30%)' }}
            >
              {animal.emoji}
            </div>
            <div className="w-3/4 h-3 rounded-full bg-stone-600 mt-2" />
            <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mt-1">???</p>
          </div>
        )}
      </button>

      {/* Info button — only shown on spotted animals */}
      {seen && (
        <button
          onClick={onInfo}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10"
          aria-label={`Info about ${animal.name}`}
        >
          <Info size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Progress header ───────────────────────────────────────────────────────
function ProgressHeader({ spottedCount, totalCount, currentBadge, nextBadge }) {
  const pct = Math.round((spottedCount / totalCount) * 100);
  return (
    <div className="mx-4 mb-4 bg-white rounded-[28px] p-5 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-5xl leading-none">{currentBadge.emoji}</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-700">Badge</p>
            <p className="safari-font text-xl text-amber-900 leading-tight">{currentBadge.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="safari-font text-4xl text-amber-900 leading-none">
            {spottedCount}<span className="text-xl text-amber-500">/{totalCount}</span>
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">stickers</p>
        </div>
      </div>
      <div className="h-4 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {nextBadge && (
        <p className="mt-2 text-xs font-bold text-amber-700">
          {nextBadge.threshold - spottedCount} more for {nextBadge.emoji} {nextBadge.title}!
        </p>
      )}
    </div>
  );
}

// ─── Main V2 Sticker screen ────────────────────────────────────────────────
export default function SafariV2Sticker({
  animals,
  seen,
  onToggleSeen,
  spottedCount,
  totalCount,
  currentBadge,
  nextBadge,
}) {
  const [activeAnimal, setActiveAnimal] = useState(null);

  return (
    <div className="pb-10">
      <div className="px-4 mb-3 text-center">
        <h2 className="safari-font text-2xl text-amber-900">My Safari Sticker Book</h2>
        <p className="text-xs font-bold text-amber-700">Tap an animal when you spot it to collect the sticker!</p>
      </div>

      <ProgressHeader
        spottedCount={spottedCount}
        totalCount={totalCount}
        currentBadge={currentBadge}
        nextBadge={nextBadge}
      />

      <div className="grid grid-cols-3 gap-4 px-4 pb-4">
        {animals.map(animal => (
          <StickerSlot
            key={animal.id}
            animal={animal}
            seen={Boolean(seen[animal.id])}
            onToggle={() => onToggleSeen(animal.id, animal.name)}
            onInfo={() => {
              setActiveAnimal(animal);
              speak(`${animal.name}. ${animal.origin}`);
            }}
          />
        ))}
      </div>

      {activeAnimal && (
        <InfoModal animal={activeAnimal} onClose={() => setActiveAnimal(null)} />
      )}
    </div>
  );
}
