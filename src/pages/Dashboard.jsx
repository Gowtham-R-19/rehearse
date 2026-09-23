import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { NAMES } from '../utils/scoring.js';

// Overview page: shows the flow and where the person is in it. Uses only data that already exists in the app.
export default function Dashboard({ session, iv, learn, history, onNavigate, onStartInterview }) {
  const missing = session ? session.analysis.kwMissing : [];
  const progress = session ? (learn[session.roleKey] || {}) : {};
  const verified = missing.filter(([l]) => progress[l]?.status === 'verified').length;
  const answered = iv ? iv.results.filter(Boolean).length : 0;
  const last = history[history.length - 1];

  const steps = [
    { n: 1, title: 'Resume review', page: 'resume', done: !!session,
      text: session ? `Score ${session.analysis.score}/100 for ${session.role.label}` : 'Upload or paste your resume and pick a role.' },
    { n: 2, title: 'Find what’s missing & learn', page: 'learn', done: !!session && missing.length > 0 && verified === missing.length, locked: !session,
      text: session ? (missing.length ? `${verified} of ${missing.length} missing skills verified` : 'No missing keywords found') : 'Unlocks after your resume review.' },
    { n: 3, title: 'Mock interview', page: 'interview', done: !!iv && answered === iv.qs.length, locked: !session,
      text: iv ? `${answered} of ${iv.qs.length} questions answered` : 'Practice questions built from your resume and role.' },
    { n: 4, title: 'Feedback & report', page: 'report', done: history.length > 0, locked: answered === 0,
      text: history.length ? `${history.length} attempt${history.length > 1 ? 's' : ''} saved in this browser` : 'Unlocks after you answer a question.' }
  ];

  return (
    <div className="stack">
      <Card className="hero">
        <h2>Get your resume reviewed like a pull request</h2>
        <p className="lede">Upload a PDF or paste the text. You get a score, line-by-line comments, a list of what to learn next, and a mock interview built from your own projects.</p>
        <div className="row">
          <Button variant="primary" onClick={() => onNavigate('resume')}>{session ? 'Review another resume' : 'Start with your resume'}</Button>
          {session && <Button onClick={onStartInterview}>Start mock interview</Button>}
        </div>
      </Card>

      <div className="flow">
        {steps.map((s, i) => (
          <button key={s.n} type="button" className={`flow-step ${s.done ? 'done' : ''}`} disabled={s.locked} onClick={() => onNavigate(s.page)}>
            <span className="flow-n">{s.done ? '\u2713' : s.n}</span>
            <strong>{s.title}</strong>
            <span className="hint">{s.text}</span>
            {i < steps.length - 1 && <span className="flow-arrow" aria-hidden="true">{'\u2192'}</span>}
          </button>
        ))}
      </div>

      <div className="report-grid">
        <Card title="Latest attempt">
          {last ? (
            <>
              {Object.keys(last).filter(k => last[k] !== null).map(k => <ProgressBar key={k} label={NAMES[k]} value={last[k]} max={100} />)}
            </>
          ) : <p className="lede">Finish a mock interview to see your scores here.</p>}
        </Card>
        <Card title="How your data is handled">
          <p>Your resume stays in this tab. Typing keeps everything on your device. Scores and learning progress are saved only in this browser.</p>
          <p className="hint">This prototype uses local, rule-based analysis. It does not call an AI service unless you load the optional on-device model.</p>
        </Card>
      </div>
    </div>
  );
}
