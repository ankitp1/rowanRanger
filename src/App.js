import React, { useState } from 'react';
import Home from './Home';
import SafariPark from './SafariPark';
import TallulahGorge from './TallulahGorge';
import HighMuseum from './HighMuseum';

export default function App() {
  const [screen, setScreen] = useState('home');

  return (
    <div className="min-h-screen">
      {screen === 'home'     && <Home onStartTrip={setScreen} />}
      {screen === 'museum'   && <HighMuseum onBack={() => setScreen('home')} />}
      {screen === 'safari'   && <SafariPark onBack={() => setScreen('home')} />}
      {screen === 'tallulah' && <TallulahGorge onBack={() => setScreen('home')} />}
    </div>
  );
}
