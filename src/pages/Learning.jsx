import { useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ResourceList from '../components/ResourceList.jsx';
import SkillBadge from '../components/SkillBadge.jsx';
import { LEARN_RES, guessTopic } from '../data/resources.js';
import { QUIZ } from '../data/quizData.js';

// One missing skill: resources + a 2-question check.
function LearnCard({ label, alts, status, onPatch }) {
  const topic = guessTopic(alts);
  const qs = QUIZ[topic] || QUIZ.general;
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState({});
  const [result, setResult] = useState(null);

  function submit() {
    const correct = qs.filter((q, i) => picked[i] === q.c).length;
    const pass = correct === qs.length;
    onPatch(cur => ({ status: pass ? 'verified' : 'studying', tries: (cur.tries || 0) + 1 }));
    setResult(pass
      ? { ok: true, text: `Nice, ${correct}/${qs.length} correct. Marked verified.` }
      : { ok: false, text: `${correct}/${qs.length} correct so far. Review the resource above, then try again.` });
  }
  function startQuiz() { setPicked({}); setResult(null); setOpen(true); }

  return (
    <div className="learn-card">
      <div className="lc-head">
        <h3>{label}</h3>
        <SkillBadge variant={status} />
      </div>
      <ResourceList ids={LEARN_RES[topic] || LEARN_RES.general} />
      <div className="lc-actions">
        {status === 'verified'
          ? <Button onClick={startQuiz}>Retake check</Button>
          : <>
              <Button onClick={startQuiz}>Take a 2-question check</Button>
              <Button onClick={() => onPatch(cur => ({ status: 'verified', tries: cur.tries || 0 }))}>I already know this</Button>
            </>}
      </div>
      {open && (
        <div className="quiz-area">
          {qs.map((q, i) => (
            <div className="quiz-q" key={i}>
              <p>{q.q}</p>
              {q.o.map((opt, j) => (
                <label key={j}>
                  <input type="radio" name={`quiz-${label}-${i}`} checked={picked[i] === j} onChange={() => setPicked(p => ({ ...p, [i]: j }))} /> {opt}
                </label>
              ))}
            </div>
          ))}
          <div className="row"><Button variant="primary" onClick={submit}>Check my answers</Button></div>
          {result && <p className={`quiz-result ${result.ok ? 'ok' : 'no'}`} role="status">{result.text}</p>}
        </div>
      )}
    </div>
  );
}

export default function Learning({ session, learn, onPatchSkill, onStartInterview }) {
  const { roleKey, role, analysis } = session;
  const missing = analysis.kwMissing;
  const progress = learn[roleKey] || {};
  const statusOf = label => progress[label]?.status || 'new';

  if (!missing.length) {
    return (
      <div className="empty">
        <h2>Nothing missing here</h2>
        <p>Every {role.label} keyword we look for turned up in your resume. Head to the mock interview to prove you can talk about it.</p>
        <Button variant="primary" onClick={onStartInterview}>Start mock interview</Button>
      </div>
    );
  }

  const verified = missing.filter(([label]) => statusOf(label) === 'verified').length;
  return (
    <div className="stack">
      <Card>
        <p className="lede">These {role.label} skills didn’t turn up in your resume. Study a resource, then take the quick check to mark it verified. Already strong? Skip ahead to the mock interview any time.</p>
        <ProgressBar label="Skills verified" value={verified} max={missing.length} note={verified === missing.length ? 'All caught up.' : ''} />
      </Card>
      <div className="learn-list">
        {missing.map(([label, alts]) => (
          <LearnCard
            key={label}
            label={label}
            alts={alts}
            status={statusOf(label)}
            onPatch={fn => onPatchSkill(roleKey, label, fn)}
          />
        ))}
      </div>
      <div className="row cta"><Button variant="primary" onClick={onStartInterview}>Start mock interview</Button></div>
    </div>
  );
}
