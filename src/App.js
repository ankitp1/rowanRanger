import React, { useState, useEffect } from 'react';
import { 
  Trees, Squirrel, Clover, Nut, Leaf, Bird, 
  Mountain, Footprints, Binoculars, Smile, 
  Waves, Bridge, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ITEMS = [
  { id: 'pinecone', name: 'Pinecone', icon: <Trees size={48}/>, color: 'text-amber-800', fact: 'These are like little houses for seeds!' },
  { id: 'squirrel', name: 'Squirrel', icon: <Squirrel size={48}/>, color: 'text-orange-600', fact: 'What is a squirrel’s favorite game? Hide and Squeak!' },
  { id: 'clover', name: 'Clover', icon: <Clover size={48}/>, color: 'text-green-500', fact: 'Clovers are lucky, just like you, Rowan!' },
  { id: 'acorn', name: 'Acorn', icon: <Nut size={48}/>, color: 'text-yellow-900', fact: 'One day, this tiny nut will be a giant Oak tree!' },
  { id: 'fern', name: 'Fern', icon: <Leaf size={48}/>, color: 'text-green-700', fact: 'Ferns have been on earth since the time of dinosaurs!' },
  { id: 'bird', name: 'Bird', icon: <Bird size={48}/>, color: 'text-blue-400', fact: 'Birds use sticks and mud to build cozy nests.' },
  { id: 'moss', name: 'Moss', icon: <Footprints size={48}/>, color: 'text-emerald-900', fact: 'Moss feels like a soft, green carpet for the forest.' },
  { id: 'rock', name: 'Smooth Rock', icon: <Mountain size={48}/>, color: 'text-gray-500', fact: 'The river washes over this rock to make it smooth.' },
  { id: 'bridge', name: 'Suspension Bridge', icon: <Bridge size={48}/>, color: 'text-slate-600', fact: 'Rowan, did you know people used to walk across this gorge on a tightrope? They were very brave!' },
  { id: 'waterfall', name: 'Waterfall', icon: <Waves size={48}/>, color: 'text-cyan-500', fact: 'That water is rushing down to the very bottom!' },
];

const COLORS = [
  { name: 'Red', hex: 'bg-red-500', prompt: 'Can you find something as Red as a strawberry?' },
  { name: 'Yellow', hex: 'bg-yellow-400', prompt: 'Can you find something as Yellow as the bright sun?' },
  { name: 'Grey', hex: 'bg-gray-400', prompt: 'Can you find something as Grey as a mountain goat?' },
];

const FUN_FACTS = [
  "The gorge is 1,000 feet deep! That’s a lot of stairs!",
  "Tallulah means 'thundering waters' in the Cherokee language!",
  "Trees talk to each other underground using their roots!",
];

const JOKES = [
  "Why did the leaf go to the doctor? Because it was feeling green!",
  "How do trees get onto the internet? They just log in!",
  "What do you call a cold forest? For-reezing!"
];

export default function RangerApp() {
  const [foundItems, setFoundItems] = useState(() => JSON.parse(localStorage.getItem('rowan-items')) || {});
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    localStorage.setItem('rowan-items', JSON.stringify(foundItems));
    const count = Object.keys(foundItems).length;
    if (count === 5 && !showBadge) {
      triggerBadge();
    }
  }, [foundItems]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2; // Friendly high pitch
    utterance.rate = 0.9;  // Slightly slower for a 4-year-old
    window.speechSynthesis.speak(utterance);
  };

  const handleItemTap = (item) => {
    const isFirst = !foundItems[item.id];
    setFoundItems(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    // Get the persona-specific line
    const personaLine = item.dialogue[activePersona.id];
    
    // Custom intro based on persona
    let intro = "";
    if (activePersona.id === 'squirrel') intro = "Squeak! Squeak!";
    if (activePersona.id === 'owl') intro = "Hoo... look there!";
    if (activePersona.id === 'ranger') intro = "Great eye, Ranger!";

    const message = isFirst 
      ? `${intro} Rowan, you found a ${item.name}! ${personaLine}` 
      : `Wow! You found another ${item.name}!`;

    speak(message);
  };

  const triggerBadge = () => {
    setShowBadge(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    speak("Wow! Rowan, you are now a Lead Detective! Look at your gold badge!");
  };

  return (
    <div className="min-h-screen bg-green-50 pb-32 p-4 font-sans select-none">
      {/* Header */}
      <header className="text-center mb-6 pt-4">
        <h1 className="text-4xl font-black text-green-900 uppercase tracking-tight">Ranger Rowan</h1>
        <p className="text-lg font-bold text-green-700">Tallulah Gorge Explorer</p>
      </header>

      {/* Scavenger Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => handleItemTap(item)}
            className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all active:scale-95 ${
              foundItems[item.id] ? 'bg-white border-green-500 shadow-lg' : 'bg-gray-100 border-gray-200 opacity-80'
            }`}
          >
            <div className={item.color}>{item.icon}</div>
            <span className="mt-2 font-bold text-gray-800 text-xl">{item.name}</span>
            {foundItems[item.id] > 0 && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-black shadow-md">
                {foundItems[item.id]}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Color Match Section */}
      <div className="bg-white rounded-3xl p-6 border-4 border-dashed border-green-200 mb-8">
        <h2 className="text-2xl font-black text-center mb-4 text-green-800">COLOR MATCH!</h2>
        <div className="flex justify-around">
          {COLORS.map(color => (
            <button
              key={color.name}
              onClick={() => speak(color.prompt)}
              className={`${color.hex} w-20 h-20 rounded-full shadow-inner border-4 border-white active:scale-110 transition-transform`}
            />
          ))}
        </div>
      </div>

      {/* Badge Overlay */}
      {showBadge && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-6 text-center" onClick={() => setShowBadge(false)}>
          <div className="bg-yellow-400 p-8 rounded-full mb-6 animate-bounce shadow-[0_0_50px_rgba(250,204,21,0.5)]">
            <Award size={120} className="text-white" />
          </div>
          <h2 className="text-5xl font-black text-white mb-2">LEAD DETECTIVE</h2>
          <h3 className="text-6xl font-black text-yellow-400 mb-6 underline">ROWAN</h3>
          <button className="bg-white text-green-900 px-8 py-4 rounded-full text-2xl font-black uppercase">Keep Exploring!</button>
        </div>
      )}

      {/* Bottom Ranger Tools */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-200 p-4 flex justify-around items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => speak(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])}
          className="bg-green-500 text-white p-4 rounded-2xl flex flex-col items-center w-1/3 mx-2 active:bg-green-600"
        >
          <Binoculars size={32} />
          <span className="font-bold text-sm uppercase mt-1">Fact</span>
        </button>

        <button 
          onClick={() => {
            setFoundItems({});
            speak("All cleared! Let's start a new adventure, Rowan!");
          }}
          className="bg-gray-200 text-gray-600 p-4 rounded-2xl flex flex-col items-center active:bg-gray-300"
        >
          <span className="font-bold text-xs uppercase">Reset</span>
        </button>

        <button 
          onClick={() => speak(JOKES[Math.floor(Math.random() * JOKES.length)])}
          className="bg-yellow-400 text-yellow-900 p-4 rounded-2xl flex flex-col items-center w-1/3 mx-2 active:bg-yellow-500"
        >
          <Smile size={32} />
          <span className="font-bold text-sm uppercase mt-1">Joke</span>
        </button>
      </nav>
    </div>
  );
}