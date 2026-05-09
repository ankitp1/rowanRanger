import React, { useState } from 'react';
import { Volume2, Info, CheckCircle2 } from 'lucide-react';
import { useAnimalImage } from './useAnimalImage';
import { speak } from './speak';

// ─── Progress + badge header ───────────────────────────────────────────────
function ProgressHeader({ spottedCount, totalCount, currentBadge, nextBadge }) {
  const pct = Math.round((spottedCount / totalCount) * 100);
  return (
    <div className="mx-4 mb-4 bg-white rounded-[28px] p-5 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{currentBadge.emoji}</span>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-700">Current Badge</p>
            <p className="safari-font text-xl text-amber-900 leading-tight">{currentBadge.title}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="safari-font text-4xl text-amber-900 leading-none">
            {spottedCount}<span className="text-xl text-amber-500">/{totalCount}</span>
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">spotted</p>
        </div>
      </div>
      <div className="h-5 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {nextBadge && (
        <p className="mt-2 text-xs font-bold text-amber-700">
          {nextBadge.threshold - spottedCount} more to unlock {nextBadge.emoji} {nextBadge.title}!
        </p>
      )}
    </div>
  );
}

// ─── Single animal card ────────────────────────────────────────────────────
function AnimalCard({ animal, seen, onToggle, onInfo }) {
  const imgSrc = useAnimalImage(animal.wikiTitle);

  return (
    <div
      className={`rounded-[28px] overflow-hidden bg-white shadow-md transition-all duration-200 flex flex-col ${
        seen ? 'ring-4 ring-amber-400 shadow-amber-200/60' : 'ring-2 ring-amber-100'
      }`}
    >
      {/* Photo area — tap to mark seen */}
      <button onClick={onToggle} className="relative block w-full flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
        <div className="absolute inset-0 stripe-bg" />
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={animal.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[72px] leading-none">
            {animal.emoji}
          </div>
        )}

        {/* Spotted badge overlay */}
        {seen && (
          <div className="absolute inset-0 bg-amber-500/15 flex items-start p-3">
            <div className="flex items-center gap-1 bg-amber-500 rounded-full px-3 py-1 shadow-md">
              <CheckCircle2 size={13} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Spotted!</span>
            </div>
          </div>
        )}
      </button>

      {/* Name row */}
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-1">
        <p className="safari-font text-[17px] text-amber-900 leading-tight flex-1 min-w-0 truncate">
          {animal.name}
        </p>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => speak(animal.sound)}
            className="rounded-full bg-amber-100 p-2 text-amber-700 active:scale-90 transition-transform"
            aria-label="Hear animal sound"
          >
            <Volume2 size={16} />
          </button>
          <button
            onClick={onInfo}
            className="rounded-full bg-amber-500 p-2 text-white active:scale-90 transition-transform"
            aria-label="Animal info"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* "I SAW IT" button */}
      <button
        onClick={onToggle}
        className={`w-full py-3 mt-1 font-black text-xs uppercase tracking-widest transition-colors ${
          seen
            ? 'bg-amber-500 text-white'
            : 'bg-amber-50 text-amber-700 border-t border-amber-100'
        }`}
      >
        {seen ? '✓ I SAW IT!' : 'Tap when you see it!'}
      </button>
    </div>
  );
}

// ─── Info modal ────────────────────────────────────────────────────────────
function InfoModal({ animal, onClose }) {
  const imgSrc = useAnimalImage(animal.wikiTitle);

  const readAll = () => {
    const text = [
      animal.name,
      animal.origin,
      animal.peculiarity,
      `Fun fact: ${animal.funFact}`,
      animal.sound,
    ].join(' ');
    speak(text);
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
        {/* Hero photo */}
        <div className="relative h-56 stripe-bg">
          {imgSrc ? (
            <img src={imgSrc} alt={animal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[90px]">
              {animal.emoji}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/60 mb-0.5">Animal Info</p>
            <h2 className="safari-font text-3xl text-white leading-tight">{animal.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-xl font-black"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🌍</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{animal.origin}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">✨</span>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{animal.peculiarity}</p>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 rounded-2xl p-3">
            <span className="text-2xl leading-none mt-0.5">⭐</span>
            <p className="text-sm font-bold text-amber-900 leading-relaxed">{animal.funFact}</p>
          </div>
          <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-3">
            <span className="text-2xl leading-none mt-0.5">🔊</span>
            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">{animal.sound}</p>
          </div>

          <button
            onClick={readAll}
            className="w-full py-4 bg-amber-500 rounded-2xl text-white font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 active:bg-amber-600 transition-colors"
          >
            <Volume2 size={20} /> Read to Me!
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main V1 Grid screen ────────────────────────────────────────────────────
export default function SafariV1Grid({
  animals,
  seen,
  onToggleSeen,
  spottedCount,
  totalCount,
  currentBadge,
  nextBadge,
}) {
  const [activeAnimal, setActiveAnimal] = useState(null);

  const openInfo = (animal) => {
    setActiveAnimal(animal);
    speak(`${animal.name}. ${animal.origin}`);
  };

  return (
    <div className="pb-8">
      <ProgressHeader
        spottedCount={spottedCount}
        totalCount={totalCount}
        currentBadge={currentBadge}
        nextBadge={nextBadge}
      />

      <div className="grid grid-cols-2 gap-3 px-4">
        {animals.map(animal => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            seen={Boolean(seen[animal.id])}
            onToggle={() => onToggleSeen(animal.id, animal.name)}
            onInfo={() => openInfo(animal)}
          />
        ))}
      </div>

      {activeAnimal && (
        <InfoModal animal={activeAnimal} onClose={() => setActiveAnimal(null)} />
      )}
    </div>
  );
}
