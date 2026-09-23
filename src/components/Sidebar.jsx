// Left navigation. `enabled` says which steps are unlocked yet.
const ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'resume', label: 'Resume Review', n: 1 },
  { id: 'learn', label: 'Learn', n: 2 },
  { id: 'interview', label: 'Mock Interview', n: 3 },
  { id: 'report', label: 'Report', n: 4 }
];

export default function Sidebar({ page, onNavigate, enabled }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="logo" aria-hidden="true">R</span>
        <div>
          <div className="brand-name">Rehearse</div>
          <div className="brand-sub">Resume Review &amp; Mock Interview Coach</div>
        </div>
      </div>

      <nav className="nav" aria-label="Steps">
        {ITEMS.map(it => {
          const locked = it.id !== 'dashboard' && it.id !== 'resume' && !enabled[it.id];
          return (
            <button
              key={it.id}
              type="button"
              className="nav-item"
              aria-current={page === it.id ? 'page' : undefined}
              disabled={locked}
              onClick={() => onNavigate(it.id)}
            >
              <span className="nav-n">{it.n || '\u2302'}</span>
              {it.label}
            </button>
          );
        })}
      </nav>

      <p className="privacy">
        Your resume stays in this tab. Typing keeps everything on your device. Scores and learning progress are saved only in this browser.
      </p>
    </aside>
  );
}
