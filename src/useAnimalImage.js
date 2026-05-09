import { useState, useEffect } from 'react';

// In-memory cache shared across all hook instances
const memCache = {};

// Pre-populate from localStorage on module load
try {
  const stored = JSON.parse(localStorage.getItem('rowan-img-cache') || '{}');
  Object.assign(memCache, stored);
} catch (_) {}

function persistCache() {
  try {
    localStorage.setItem('rowan-img-cache', JSON.stringify(memCache));
  } catch (_) {}
}

export function useAnimalImage(wikiTitle) {
  const [src, setSrc] = useState(memCache[wikiTitle] || null);

  useEffect(() => {
    if (!wikiTitle || memCache[wikiTitle]) {
      if (memCache[wikiTitle] && memCache[wikiTitle] !== src) setSrc(memCache[wikiTitle]);
      return;
    }
    const url =
      `https://en.wikipedia.org/w/api.php` +
      `?action=query&titles=${encodeURIComponent(wikiTitle)}` +
      `&prop=pageimages&format=json&pithumbsize=600&origin=*`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const pages = data?.query?.pages || {};
        const page = pages[Object.keys(pages)[0]];
        const imgUrl = page?.thumbnail?.source;
        if (imgUrl) {
          memCache[wikiTitle] = imgUrl;
          persistCache();
          setSrc(imgUrl);
        }
      })
      .catch(() => {});
  }, [wikiTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  return src;
}
