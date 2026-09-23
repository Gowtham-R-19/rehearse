// Small text helpers used by the analysis services.

export const words = t => (String(t).trim().match(/\S+/g) || []).length;

export const cut = (s, n) => s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;

// has(text, 'a|b|c'): true if any alternative appears. Short terms must match as whole words.
export function has(text, alts) {
  const t = text.toLowerCase();
  return alts.split('|').some(a => {
    a = a.trim().toLowerCase();
    if (a.length <= 4) {
      const re = new RegExp('(^|[^a-z0-9])' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)');
      return re.test(t);
    }
    return t.includes(a);
  });
}
