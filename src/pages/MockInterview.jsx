import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import ScoreChip from '../components/ScoreChip.jsx';
import { evaluate, getFeedbackTips, questionMessage } from '../services/interviewAnalysis.js';
import { AI, aiAnswerNote } from '../services/onDeviceAI.js';
import { words } from '../utils/textUtils.js';
import { uid } from '../utils/helpers.js';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function Feedback({ m }) {
  const r = m.res, tech = r.q.type === 'tech' || r.q.type === 'resume';
  return (
    <div className="fb">
      <div className="chips">
        <ScoreChip label="Communication" value={r.comm} />
        <ScoreChip label="Confidence" value={r.conf} />
        <ScoreChip label={tech ? 'Technical' : 'Structure'} value={r.content} />
      </div>
      <ul>{getFeedbackTips(r).map((t, i) => <li key={i}>{t}</li>)}</ul>
      {m.aiNote && <div className="ai-note"><b>AI coach:</b> {m.aiNote}</div>}
    </div>
  );
}

export default function MockInterview({ iv, setIv, roleLabel, onOpenReport, onStart }) {
  const [answer, setAnswer] = useState('');
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const rec = useRef(null), t0 = useRef(0), on = useRef(false);
  const voice = useRef({ sec: 0, words: 0 });
  const chatRef = useRef(null), taRef = useRef(null);

  // scroll chat down + reset voice stats when a new question starts
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [iv?.messages.length]);
  useEffect(() => { voice.current = { sec: 0, words: 0 }; if (iv?.phase === 'answer') taRef.current?.focus(); }, [iv?.qs, iv?.i, iv?.phase]);
  useEffect(() => () => { if (on.current) { on.current = false; try { rec.current.stop(); } catch (_) {} } }, []);

  if (!iv) {
    return <div className="empty"><h2>No interview yet</h2><Button variant="primary" onClick={onStart}>Start mock interview</Button></div>;
  }

  /* ---- voice input (browser speech service) ---- */
  function startMic() {
    rec.current = new SR(); const r = rec.current;
    r.continuous = true; r.interimResults = true; r.lang = navigator.language || 'en-US';
    r.onresult = e => {
      let fin = '', inter = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const x = e.results[i]; if (x.isFinal) fin += x[0].transcript + ' '; else inter += x[0].transcript; }
      if (fin) { setAnswer(a => (a + ' ' + fin).trim()); voice.current.words += words(fin); }
      setInterim(inter);
    };
    r.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { stopMic(); setInterim('Microphone blocked. Allow it in your browser, or type your answer.'); } };
    r.onend = () => { if (on.current) { try { r.start(); } catch (_) {} } };
    try { r.start(); on.current = true; t0.current = Date.now(); setListening(true); } catch (_) {}
  }
  function stopMic() {
    if (!on.current) return;
    on.current = false; voice.current.sec += (Date.now() - t0.current) / 1000;
    try { rec.current.stop(); } catch (_) {}
    setListening(false); setInterim('');
  }

  /* ---- answering ---- */
  function finish(skipped, buf, messages) {
    const q = iv.qs[iv.i]; let res = null;
    if (!skipped) {
      const v = voice.current;
      const wpm = (v.sec >= 5 && v.words >= 12) ? Math.round(v.words / (v.sec / 60)) : null;
      res = evaluate(q, buf, wpm); res.q = q; res.text = buf;
      const id = uid();
      messages = [...messages, { id, kind: 'fb', res, aiNote: AI.ready ? 'AI coach is thinking…' : '' }];
      if (AI.ready) {
        const setNote = note => setIv(p => p && ({ ...p, messages: p.messages.map(m => m.id === id ? { ...m, aiNote: note } : m) }));
        aiAnswerNote(q.text, buf).then(setNote).catch(() => setNote(''));
      }
    } else {
      messages = [...messages, { id: uid(), kind: 'bot', text: 'Skipped. In a real interview, say what you do know, then how you would find out the rest.' }];
    }
    setIv({ ...iv, buf, messages, results: [...iv.results, res], phase: 'next' });
  }

  function send() {
    const text = answer.trim();
    if (!text) { setInterim('Type or speak an answer first.'); return; }
    stopMic();
    const buf = iv.buf ? iv.buf + ' ' + text : text;
    const messages = [...iv.messages, { id: uid(), kind: 'me', text }];
    setAnswer('');
    if (!iv.followed && words(buf) < 25) {
      setIv({ ...iv, buf, followed: true, messages: [...messages, { id: uid(), kind: 'bot', text: 'Can you add more detail or a specific example? One or two more sentences will do.' }] });
      taRef.current?.focus();
      return;
    }
    finish(false, buf, messages);
  }

  function skip() { stopMic(); setAnswer(''); finish(true, iv.buf, iv.messages); }

  function next() {
    if (iv.i === iv.qs.length - 1) { onOpenReport(); return; }
    const i = iv.i + 1;
    setIv({ ...iv, i, buf: '', followed: false, phase: 'answer', messages: [...iv.messages, questionMessage(iv.qs[i])] });
  }

  const last = iv.i === iv.qs.length - 1;
  return (
    <div className="stack">
      <div className="iv-head">
        <p>{roleLabel} interview, {iv.qs.length} questions</p>
        <div className="prog">
          <span>Question {iv.i + 1} of {iv.qs.length}</span>
          <div className="track"><i style={{ width: (iv.i / iv.qs.length * 100) + '%' }} /></div>
        </div>
      </div>

      <div className="chat" ref={chatRef} aria-live="polite">
        {iv.messages.map(m => m.kind === 'fb' ? <Feedback key={m.id} m={m} /> : (
          <div key={m.id} className={`msg ${m.kind}`}>
            {m.tag && <span className="tag">{m.tag}</span>}{m.text}
          </div>
        ))}
      </div>

      {iv.phase === 'answer' ? (
        <div className="composer">
          <label htmlFor="answer" className="sr">Your answer</label>
          <textarea id="answer" ref={taRef} rows={4} placeholder="Type your answer, or press Speak" value={answer} onChange={e => setAnswer(e.target.value)} />
          <div className="row">
            {SR && <Button variant={listening ? 'live' : 'ghost'} onClick={() => listening ? stopMic() : startMic()}>{listening ? 'Stop' : 'Speak'}</Button>}
            <span className="interim">{interim}</span>
            <Button onClick={skip}>Skip question</Button>
            <Button variant="primary" onClick={send}>Send answer</Button>
          </div>
          <p className="note">{SR ? 'Voice uses your browser\'s speech service, which may send audio online. Typing keeps everything on your device.' : 'Voice input is not supported in this browser. Type your answer.'}</p>
        </div>
      ) : (
        <div className="composer"><Button variant="primary" autoFocus onClick={next}>{last ? 'See my report' : 'Next question'}</Button></div>
      )}
    </div>
  );
}
