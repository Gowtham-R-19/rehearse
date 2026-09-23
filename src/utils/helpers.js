// General-purpose helpers (math, random, browser storage, download).

export const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
export const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
export const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

let counter = 0;
export const uid = () => ++counter;

// History and "learn what's missing" progress are saved to localStorage so they survive a refresh.
// (Voice input and resume text itself are never saved.)
export function loadJSON(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (_) { return fallback; } }
export function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} }

// Downloads text as a file. Returns false if the browser blocked it.
export function downloadTextFile(filename, text) {
  try {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    return true;
  } catch (_) { return false; }
}
