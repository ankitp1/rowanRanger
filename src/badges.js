export const BADGES = [
  { threshold: 0,  title: 'Explorer',          emoji: '🗺️', bg: '#e2e8f0', text: '#475569' },
  { threshold: 1,  title: 'Junior Spotter',    emoji: '🔭', bg: '#fef3c7', text: '#92400e' },
  { threshold: 5,  title: 'Safari Scout',      emoji: '🦁', bg: '#fed7aa', text: '#9a3412' },
  { threshold: 10, title: 'Wildlife Expert',   emoji: '🌿', bg: '#d1fae5', text: '#065f46' },
  { threshold: 20, title: 'Safari Hero',       emoji: '⭐', bg: '#ede9fe', text: '#5b21b6' },
  { threshold: 31, title: 'Legendary Ranger',  emoji: '🏆', bg: '#fef9c3', text: '#713f12' },
];

export function getBadge(count) {
  let badge = BADGES[0];
  for (const b of BADGES) {
    if (count >= b.threshold) badge = b;
  }
  return badge;
}

export function getNextBadge(count) {
  return BADGES.find(b => b.threshold > count) || null;
}
