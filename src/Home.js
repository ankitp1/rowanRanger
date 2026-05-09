import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';

const TRIPS = [
  {
    id: 'museum',
    label: 'NEXT TRIP',
    title: 'High Museum of Art',
    subtitle: 'Find famous artworks!',
    from: '#7c2d12',
    to: '#b45309',
    emoji: '🖼️🎨🏛️',
    corner: '✨',
  },
  {
    id: 'safari',
    label: 'UPCOMING TRIP',
    title: 'Alabama Safari Park',
    subtitle: 'Spot wild animals!',
    from: '#f97316',
    to: '#e11d48',
    emoji: '🦓🦒🦏',
    corner: '🦘',
  },
  {
    id: 'tallulah',
    label: 'LAST TRIP',
    title: 'Tallulah Gorge',
    subtitle: 'Hike the thundering waters',
    from: '#059669',
    to: '#0f766e',
    emoji: '🌲🦌🌊🐿️',
    corner: '🍄',
  },
];

export default function Home({ onStartTrip }) {
  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: 'linear-gradient(160deg, #fff8eb 0%, #fde68a40 50%, #fff8eb 100%)' }}
    >
      <div className="mx-auto max-w-md">

        {/* Explorer Passport pill */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-white rounded-full px-5 py-3 shadow-md border border-amber-200/80">
            <span className="text-xl">🧭</span>
            <span className="text-xs font-black uppercase tracking-[0.32em] text-amber-800">Explorer Passport</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="text-center mb-10">
          <h1 className="safari-font text-[72px] leading-none text-amber-900 mb-2">Hi Rowan!</h1>
          <p className="text-lg font-black text-amber-700">Pick your next adventure</p>
        </div>

        {/* Trip cards */}
        <div className="space-y-5">
          {TRIPS.map((trip) => (
            <button
              key={trip.id}
              onClick={() => onStartTrip(trip.id)}
              className="w-full text-left rounded-[36px] p-7 shadow-xl relative overflow-hidden active:scale-[0.97] transition-transform duration-150"
              style={{ background: `linear-gradient(135deg, ${trip.from}, ${trip.to})` }}
            >
              {/* Label */}
              <p className="text-[10px] font-black uppercase tracking-[0.38em] text-white/70 mb-3">{trip.label}</p>

              {/* Title */}
              <h2 className="safari-font text-[40px] leading-tight text-white mb-2">{trip.title}</h2>
              <p className="text-sm font-bold text-white/85 mb-6">{trip.subtitle}</p>

              {/* CTA */}
              <div className="flex items-center gap-2 bg-white/25 rounded-full px-5 py-3 w-fit backdrop-blur-sm">
                <span className="text-sm font-black text-white uppercase tracking-wide">Tap to start</span>
                <ArrowRight size={16} className="text-white" />
              </div>

              {/* Decorative animals */}
              <span className="absolute top-5 right-5 text-5xl leading-none pointer-events-none select-none">
                {trip.emoji}
              </span>
              <span className="absolute bottom-5 right-5 text-4xl pointer-events-none select-none">
                {trip.corner}
              </span>
            </button>
          ))}

          {/* Locked future trip */}
          <div
            className="rounded-[36px] p-7 border-2 border-purple-200"
            style={{ background: 'linear-gradient(135deg, #e9d5ff60, #ddd6fe80)' }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-purple-600 mb-3">FUTURE</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="safari-font text-[36px] leading-tight text-purple-900 mb-2">Next Adventure</h2>
                <p className="text-sm font-bold text-purple-700 mb-5">Coming soon...</p>
                <div className="flex items-center gap-2 bg-purple-200/70 rounded-full px-4 py-3 w-fit">
                  <Lock size={14} className="text-purple-700" />
                  <span className="text-xs font-black text-purple-700 uppercase tracking-widest">Locked</span>
                </div>
              </div>
              <span className="text-5xl leading-none">✨🏔️🦋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
