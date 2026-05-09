import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { speak } from './speak';

const ITEMS = [
  { id: 'pinecone',  name: 'Pinecone',          emoji: '🌲', fact: 'Pinecones protect seeds from the cold winter and are very prickly!' },
  { id: 'squirrel',  name: 'Squirrel',           emoji: '🐿️', fact: 'Squirrels hide hundreds of nuts and somehow remember where most of them are!' },
  { id: 'clover',    name: 'Clover',             emoji: '🍀', fact: 'Can you find one with four leaves? That means super good luck!' },
  { id: 'acorn',     name: 'Acorn',              emoji: '🌰', fact: 'This tiny nut will one day grow into a giant oak tree!' },
  { id: 'fern',      name: 'Fern',               emoji: '🌿', fact: 'Ferns have been on Earth since the time of the dinosaurs!' },
  { id: 'bird',      name: 'Bird',               emoji: '🐦', fact: 'Birds use sticks, mud and grass to build their cozy nests.' },
  { id: 'moss',      name: 'Moss',               emoji: '🧤', fact: 'Moss feels like a soft green sponge. It loves damp shady spots.' },
  { id: 'rock',      name: 'Smooth Rock',        emoji: '🪨', fact: 'The river polishes rocks over thousands of years to make them smooth.' },
  { id: 'bridge',    name: 'Suspension Bridge',  emoji: '🌉', fact: 'Hold the railing! We are very high above the thundering river!' },
  { id: 'waterfall', name: 'Waterfall',          emoji: '💦', fact: 'That rushing water carved this gorgeous gorge over millions of years!' },
];

const BADGES = [
  { threshold: 0,  title: 'Explorer',       emoji: '🗺️' },
  { threshold: 3,  title: 'Trail Scout',    emoji: '🥾' },
  { threshold: 5,  title: 'Lead Detective', emoji: '🔍' },
  { threshold: 8,  title: 'Gorge Ranger',   emoji: '⛰️' },
  { threshold: 10, title: 'Master Explorer',emoji: '🏆' },
];

function getBadge(count) {
  let b = BADGES[0];
  for (const badge of BADGES) {
    if (count >= badge.threshold) b = badge;
  }
  return b;
}

export default function TallulahGorge({ onBack }) {
  const [found, setFound] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rowan-tallulah-v2')) || {}; } catch { return {}; }
  });
  const [prevBadgeThreshold, setPrevBadgeThreshold] = useState(0);

  const foundCount = Object.values(found).filter(Boolean).length;
  const currentBadge = getBadge(foundCount);
  const pct = Math.round((foundCount / ITEMS.length) * 100);

  useEffect(() => {
    try { localStorage.setItem('rowan-tallulah-v2', JSON.stringify(found)); } catch {}

    const badgeThreshold = currentBadge.threshold;
    if (badgeThreshold > prevBadgeThreshold && foundCount > 0) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.5 } });
      speak(`Wow Rowan! You earned the ${currentBadge.title} badge! ${currentBadge.emoji} Keep exploring!`);
      setPrevBadgeThreshold(badgeThreshold);
    }
  }, [found]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    speak('Welcome back to Tallulah Gorge! Tap what you find on the trail!');
  }, []);

  const toggle = (item) => {
    const wasFound = Boolean(found[item.id]);
    setFound(prev => ({ ...prev, [item.id]: !wasFound }));
    if (!wasFound) speak(`You found a ${item.name}! ${item.fact}`);
    else speak(`Unchecked ${item.name}.`);
  };

  const reset = () => {
    setFound({});
    setPrevBadgeThreshold(0);
    speak('All cleared! Ready for a new adventure at Tallulah Gorge!');
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'linear-gradient(to bottom, #ecfdf5, #d1fae5)' }}>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-sm border-b-2 border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-2xl bg-emerald-100 px-3 py-2.5 text-sm font-black text-emerald-800 active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.35em] text-emerald-600 font-black">Explorer</p>
          <h1 className="safari-font text-xl text-emerald-900 leading-tight">Tallulah Gorge</h1>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-2xl bg-rose-100 px-3 py-2.5 text-sm font-black text-rose-700 active:scale-95 transition-transform"
        >
          <RefreshCw size={15} /> Reset
        </button>
      </header>

      <div className="px-4 pt-4 space-y-4">

        {/* Progress card */}
        <div className="bg-white rounded-[28px] p-5 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentBadge.emoji}</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Badge</p>
                <p className="safari-font text-xl text-emerald-900 leading-tight">{currentBadge.title}</p>
              </div>
            </div>
            <p className="safari-font text-4xl text-emerald-900">
              {foundCount}<span className="text-xl text-emerald-500">/{ITEMS.length}</span>
            </p>
          </div>
          <div className="h-5 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-2 gap-3">
          {ITEMS.map(item => {
            const isFound = Boolean(found[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                className={`rounded-[28px] p-5 flex flex-col items-center gap-2 border-4 transition-all duration-200 active:scale-95 ${
                  isFound
                    ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-200/60'
                    : 'bg-white border-white shadow-md'
                }`}
              >
                <span className="text-6xl leading-none">{item.emoji}</span>
                <span className={`safari-font text-xl text-center leading-tight ${isFound ? 'text-white' : 'text-emerald-900'}`}>
                  {item.name}
                </span>
                {isFound && (
                  <span className="text-white/90 text-xs font-black uppercase tracking-widest bg-white/25 rounded-full px-3 py-1">
                    ✓ Found!
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
