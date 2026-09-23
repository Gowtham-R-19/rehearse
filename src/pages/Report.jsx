import { useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ResourceList from '../components/ResourceList.jsx';
import ScoreChip from '../components/ScoreChip.jsx';
import { NAMES, TIPS, computeScores, pickReportResources } from '../utils/scoring.js';
import { downloadTextFile } from '../utils/helpers.js';
import { cut } from '../utils/textUtils.js';

export default function Report({ iv, session, learn, history, onNavigate, onRestart }) {
  const { analysis, role, roleKey, text } = session;
  const { S, R, techR, keys, weakest } = computeScores(iv.results, analysis.score);
  const ids = pickReportResources(techR, analysis, role);

  const learnMap = learn[roleKey] || {};
  const learned = Object.keys(learnMap).filter(k => learnMap[k].status === 'verified');
  const [updated, setUpdated] = useState(
    text.trimEnd() + '\n\nADDITIONAL SKILLS (practiced and verified with Rehearse)\n' + learned.join(', ')
  );
  const [dlNote, setDlNote] = useState('');

  const isTech = r => r.q.type === 'tech' || r.q.type === 'resume';
  return (
    <div className="stack">
      <p className="lede">Your weakest area right now is <b>{NAMES[weakest].toLowerCase()}</b> ({S[weakest]}/100). Work on that first.</p>

      <div className="report-grid">
        <Card title="Your scores">
          {keys.map(k => <ProgressBar key={k} label={NAMES[k]} value={S[k]} max={100} />)}
          {history.length > 1 && (
            <>
              <h3 style={{ marginTop: 20 }}>Your attempts</h3>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Attempt</th><th>Comm.</th><th>Conf.</th><th>Tech.</th><th>Struct.</th></tr></thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}><td>{i + 1}</td><td>{h.comm}</td><td>{h.conf}</td><td>{h.tech === null ? '-' : h.tech}</td><td>{h.struct === null ? '-' : h.struct}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>

        <Card title="Work on this first">
          <ul>{TIPS[weakest].map((t, i) => <li key={i}>{t}</li>)}</ul>
          <h3 style={{ marginTop: 20 }}>Learning resources</h3>
          {ids.length ? <ResourceList ids={ids} /> : <p>Your technical answers covered the key points. Keep practising with a new set of questions.</p>}
        </Card>
      </div>

      <Card title="Question by question">
        {R.map((r, i) => (
          <details className="q" key={i}>
            <summary>{cut(r.q.text, 100)}</summary>
            <p className="you">{r.text}</p>
            <div className="chips">
              <ScoreChip label="Communication" value={r.comm} />
              <ScoreChip label="Confidence" value={r.conf} />
              <ScoreChip label={isTech(r) ? 'Technical' : 'Structure'} value={r.content} />
            </div>
          </details>
        ))}
      </Card>

      <Card title="Update your resume">
        {learned.length ? (
          <>
            <p className="lede">You verified {learned.length} skill{learned.length > 1 ? 's' : ''} in Learn what’s missing that weren’t in your original resume. Review the line added below, edit anything, then download.</p>
            <label htmlFor="updated-resume" className="sr">Updated resume text</label>
            <textarea id="updated-resume" rows={14} value={updated} onChange={e => setUpdated(e.target.value)} />
            <div className="row">
              <Button variant="primary" onClick={() => setDlNote(downloadTextFile('updated-resume.txt', updated) ? '' : 'Could not download automatically. Select the text above and copy it instead.')}>Download updated resume (.txt)</Button>
              <span className="note">{dlNote}</span>
            </div>
            <p className="note">This only adds skills you actually verified here. Add real project details or dates before you send it anywhere.</p>
          </>
        ) : (
          <>
            <p className="lede">Verify a few skills in Learn what’s missing and they’ll be added to a downloadable copy of your resume here.</p>
            {analysis.kwMissing.length > 0 && <Button onClick={() => onNavigate('learn')}>Go to Learn what’s missing</Button>}
          </>
        )}
      </Card>

      <div className="row cta">
        <Button variant="primary" onClick={onRestart}>Practise again</Button>
        <Button onClick={() => onNavigate('resume')}>Review a different resume</Button>
        <Button onClick={() => window.print()}>Print report</Button>
      </div>
    </div>
  );
}
