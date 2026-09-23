import { useMemo, useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import { ROLES, nearestRoleKey } from '../data/roles.js';
import { SAMPLE } from '../data/sampleResume.js';
import { readPdf } from '../services/pdfReader.js';
import { AI } from '../services/onDeviceAI.js';
import { words } from '../utils/textUtils.js';
import { verdictFor } from '../utils/scoring.js';

// Turns analysis.items into rows for the "line-by-line" view (max 14 non-"good" comments shown).
function buildReviewRows(items) {
  let shown = 0, hidden = 0;
  const rows = items.map(it => {
    if (it.head) return { head: true, t: it.t };
    const c = it.c || [];
    const cls = c.some(x => x.k !== 'good') ? 'hl' : c.length ? 'ok' : '';
    const comments = [];
    c.forEach(x => { if (shown < 14 || x.k === 'good') { shown++; comments.push(x); } else hidden++; });
    return { t: it.t, cls, comments };
  });
  return { rows, hidden };
}

function Results({ session, aiFeedback, onNavigate, onStartInterview }) {
  const { analysis: a, role } = session;
  const { rows, hidden } = useMemo(() => buildReviewRows(a.items), [a]);
  const list = (title, arr, color) => (
    <div className="col" style={{ '--c': color }}>
      <h3>{title}</h3>
      <ul>{arr.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  );

  return (
    <div className="stack">
      <Card>
        <ScoreCard score={a.score} title="Resume score" text={verdictFor(a.score)} />
        {a.cats.map(c => <ProgressBar key={c.name} label={c.name} value={c.pts} max={c.max} note={c.note} />)}
      </Card>

      <div className="cols">
        {list('What works', a.strengths, 'var(--good)')}
        {list('What to fix', a.weaknesses, 'var(--bad)')}
        {list('What to add', a.opps, 'var(--primary)')}
      </div>

      <Card title={`Keywords for ${role.label}`}>
        <div className="kw">
          {a.kwFound.map(k => <SkillBadge key={k[0]} variant="found">{k[0]}</SkillBadge>)}
          {a.kwMissing.map(k => <SkillBadge key={k[0]} variant="missing">{k[0]}</SkillBadge>)}
        </div>
        <p className="hint">Solid chips are found in your resume. Dashed chips are missing.</p>
      </Card>

      <div className="ai-out">
        {!AI.ready && <p className="note">Want written feedback too? Load on-device AI in the left panel.</p>}
        {AI.ready && aiFeedback?.status === 'loading' && <p className="note">On-device AI is reading your resume…</p>}
        {AI.ready && aiFeedback?.status === 'done' && (
          <Card title="On-device AI feedback"><div className="ai-text" style={{ whiteSpace: 'pre-wrap' }}>{aiFeedback.text}</div></Card>
        )}
        {AI.ready && aiFeedback?.status === 'error' && <p className="note bad">AI feedback failed: {aiFeedback.text}</p>}
      </div>

      <Card title="Line-by-line review">
        <p className="legend"><mark>Highlighted</mark> lines have a comment. Underlined green lines are already strong.</p>
        <div className="sheet">
          {rows.map((r, i) => r.head ? <div key={i} className="ln head">{r.t}</div> : (
            <div key={i}>
              <div className="ln"><span className={`txt ${r.cls}`}>{r.t}</span></div>
              {r.comments.map((x, j) => <div key={j} className={`cm ${x.k}`}>{x.m}</div>)}
            </div>
          ))}
        </div>
        {hidden > 0 && <p className="hint">{hidden} more comments hidden. Fix these first, then review again.</p>}
      </Card>

      <div className="row cta">
        {a.kwMissing.length > 0 && <Button onClick={() => onNavigate('learn')}>Learn what’s missing ({a.kwMissing.length})</Button>}
        <Button variant="primary" onClick={onStartInterview}>Start mock interview</Button>
      </div>
    </div>
  );
}

export default function ResumeReview({
  roleKey, setRoleKey, customRole, setCustomRole, draft, setDraft,
  session, onAnalyze, onStartInterview, onNavigate, aiFeedback, onAiFeedback
}) {
  const [msg, setMsg] = useState({ text: '', bad: false });
  const [roleNote, setRoleNote] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [ai, setAi] = useState({ loading: false, pct: 0, status: AI.ready ? 'On-device AI is ready. It runs in this browser.' : '' });
  const say = (text, bad = false) => setMsg({ text, bad });

  function useCustomRole() {
    const title = customInput.trim();
    if (!title) { setRoleNote('Type a role first, such as "Embedded systems engineer".'); return; }
    const baseKey = nearestRoleKey(title);
    setCustomRole({ label: title, baseKey });
    setRoleKey('custom');
    setRoleNote('We don’t have a tailored bank for "' + title + '" yet, so it borrows keywords and questions from ' + ROLES[baseKey].label + '.');
  }

  async function onFile(e) {
    const f = e.target.files[0]; if (!f) return;
    say('Reading ' + f.name + '…');
    try {
      const t = await readPdf(f);
      setDraft(t);
      say(t.trim() ? 'PDF read. Check the text below, then choose Review my resume.' : 'No text found. This PDF may be a scan. Paste the text instead.', !t.trim());
    } catch (err) { say((err && err.message) || 'Could not read that PDF. Paste the text instead.', true); }
    e.target.value = '';
  }

  function analyzeClick() {
    if (words(draft) < 40) { say('Add more of your resume (at least a few lines) to get a useful review.', true); return; }
    onAnalyze(draft);
    say('Review ready.');
    if (window.innerWidth <= 980) setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  async function loadAI() {
    setAi({ loading: true, pct: 0, status: 'Preparing…' });
    try {
      await AI.load((txt, p) => setAi({ loading: true, pct: Math.round((p || 0) * 100), status: txt }));
      setAi({ loading: false, pct: 100, status: 'On-device AI is ready. It runs in this browser.' });
      if (session) onAiFeedback();
    } catch (e) {
      setAi({ loading: false, pct: 0, status: 'Could not load on-device AI: ' + (e.message || e) + ' The rule-based review still works.' });
    }
  }

  return (
    <div className="grid">
      <div className="side stack">
        <Card title="1. Choose a role">
          <label htmlFor="role">Target role</label>
          <select id="role" value={roleKey} onChange={e => setRoleKey(e.target.value)}>
            {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
            {customRole && <option value="custom">{customRole.label}</option>}
          </select>

          <label htmlFor="customRole">Don't see your role? Type it in</label>
          <input id="customRole" type="text" placeholder="e.g. Embedded systems engineer" value={customInput} onChange={e => setCustomInput(e.target.value)} />
          <div className="row"><Button onClick={useCustomRole}>Use this role</Button></div>
          <p className="note" role="status">{roleNote}</p>
        </Card>

        <Card title="2. Add your resume">
          <label className="drop" htmlFor="file"><strong>Upload PDF</strong><span>or paste your resume text below</span></label>
          <input id="file" className="sr" type="file" accept="application/pdf" onChange={onFile} />

          <label htmlFor="text">Resume text</label>
          <textarea id="text" rows={12} placeholder="Paste your resume here" value={draft} onChange={e => setDraft(e.target.value)} />
          <div className="row">
            <Button onClick={() => { setDraft(SAMPLE); say('Sample loaded. Choose Review my resume.'); }}>Try a sample resume</Button>
            <Button variant="primary" onClick={analyzeClick}>Review my resume</Button>
          </div>
          <p className={`note ${msg.bad ? 'bad' : ''}`} role="status">{msg.text}</p>
        </Card>

        <details className="ai-box card">
          <summary>On-device AI (optional)</summary>
          <p className="note">Runs a small language model inside your browser using WebGPU, so nothing is sent to a server. The first load downloads roughly 1 GB. Works best in recent Chrome or Edge on a laptop.</p>
          <div className="row"><Button onClick={loadAI} disabled={ai.loading || AI.ready}>{AI.ready ? 'AI loaded' : 'Load on-device AI'}</Button></div>
          <div className="track" style={{ marginTop: 10 }}><i style={{ width: ai.pct + '%' }} /></div>
          <p className="note" role="status">{ai.status}</p>
        </details>
      </div>

      <div id="results">
        {session ? (
          <Results session={session} aiFeedback={aiFeedback} onNavigate={onNavigate} onStartInterview={onStartInterview} />
        ) : (
          <div className="empty">
            <h2>Your review appears here</h2>
            <p>Add your resume, then choose Review my resume. You will see your score, what works, what to fix, and comments on individual lines.</p>
          </div>
        )}
      </div>
    </div>
  );
}
