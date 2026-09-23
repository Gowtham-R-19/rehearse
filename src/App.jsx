import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ResumeReview from './pages/ResumeReview.jsx';
import Learning from './pages/Learning.jsx';
import MockInterview from './pages/MockInterview.jsx';
import Report from './pages/Report.jsx';
import { getRole } from './data/roles.js';
import { analyze } from './services/resumeAnalysis.js';
import { createInterview } from './services/interviewAnalysis.js';
import { AI, aiResumeFeedback } from './services/onDeviceAI.js';
import { computeScores } from './utils/scoring.js';
import { loadJSON, saveJSON } from './utils/helpers.js';

const PAGES = {
  dashboard: ['Dashboard', 'Resume → Analyze → Learn → Practice → Mock interview → Report'],
  resume: ['Resume Review', 'Get a score, line-by-line comments and a list of missing skills.'],
  learn: ['Learn what’s missing', 'Study the skills your resume doesn’t show yet.'],
  interview: ['Mock Interview', 'Answer questions built from your resume and target role.'],
  report: ['Your report', 'Scores, tips and resources from your latest interview.']
};

// App.jsx keeps ALL app state and passes it to the pages. Business logic lives in src/services and src/utils.
export default function App() {
  const [page, setPage] = useState('dashboard');
  const [roleKey, setRoleKey] = useState('dev');          // selected in the dropdown
  const [customRole, setCustomRole] = useState(null);     // { label, baseKey }
  const [draft, setDraft] = useState('');                 // resume text in the textarea
  const [session, setSession] = useState(null);           // { roleKey, role, text, analysis } after "Review my resume"
  const [iv, setIv] = useState(null);                     // current mock interview
  const [history, setHistory] = useState(() => loadJSON('rehearse_history_v1', []));
  const [learn, setLearn] = useState(() => loadJSON('rehearse_learn_v1', {}));
  const [aiFeedback, setAiFeedback] = useState(null);     // optional on-device AI feedback

  useEffect(() => { window.scrollTo({ top: 0 }); }, [page]);

  /* ---- Step 1: analyze resume (local, rule-based) ---- */
  function analyzeResume(text) {
    const role = getRole(roleKey, customRole);
    const s = { roleKey, role, text, analysis: analyze(text, role) };
    setSession(s); setIv(null); setAiFeedback(null);
    if (AI.ready) runAiFeedback(s);
  }
  async function runAiFeedback(s = session) {
    setAiFeedback({ status: 'loading' });
    try { setAiFeedback({ status: 'done', text: await aiResumeFeedback(s.text, s.role.label) }); }
    catch (e) { setAiFeedback({ status: 'error', text: e.message || String(e) }); }
  }

  /* ---- Step 2: learning progress (saved in this browser) ---- */
  function patchSkill(rk, label, fn) {
    setLearn(prev => {
      const cur = (prev[rk] && prev[rk][label]) || { status: 'new', tries: 0 };
      const next = { ...prev, [rk]: { ...(prev[rk] || {}), [label]: { ...cur, ...fn(cur) } } };
      saveJSON('rehearse_learn_v1', next);
      return next;
    });
  }

  /* ---- Step 3: mock interview ---- */
  function startInterview() {
    if (!session) return;
    setIv(createInterview(session.analysis, session.role));
    setPage('interview');
  }

  /* ---- Step 4: report (saves scores to history once, when the interview is complete) ---- */
  function openReport() {
    if (!iv || !iv.results.some(Boolean)) return;
    if (!iv.reported && iv.results.length === iv.qs.length) {
      const { S } = computeScores(iv.results, session.analysis.score);
      const next = [...history, S];
      setHistory(next); saveJSON('rehearse_history_v1', next);
      setIv({ ...iv, reported: true });
    }
    setPage('report');
  }

  function navigate(p) {
    if (p === 'interview') { if (!session) return; if (!iv) return startInterview(); }
    if (p === 'report') return openReport();
    if (p === 'learn' && !session) return;
    setPage(p);
  }

  const enabled = { learn: !!session, interview: !!session, report: !!iv && iv.results.some(Boolean) };
  const [title, subtitle] = PAGES[page];

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <Sidebar page={page} onNavigate={navigate} enabled={enabled} />
      <div className="content">
        <Header title={title} subtitle={subtitle} />
        <main id="main" className="page">
          {page === 'dashboard' && <Dashboard session={session} iv={iv} learn={learn} history={history} onNavigate={navigate} onStartInterview={startInterview} />}
          {page === 'resume' && (
            <ResumeReview
              roleKey={roleKey} setRoleKey={setRoleKey} customRole={customRole} setCustomRole={setCustomRole}
              draft={draft} setDraft={setDraft} session={session}
              onAnalyze={analyzeResume} onStartInterview={startInterview} onNavigate={navigate}
              aiFeedback={aiFeedback} onAiFeedback={() => runAiFeedback()}
            />
          )}
          {page === 'learn' && session && <Learning session={session} learn={learn} onPatchSkill={patchSkill} onStartInterview={startInterview} />}
          {page === 'interview' && <MockInterview iv={iv} setIv={setIv} roleLabel={session?.role.label} onOpenReport={openReport} onStart={startInterview} />}
          {page === 'report' && iv && session && <Report iv={iv} session={session} learn={learn} history={history} onNavigate={navigate} onRestart={startInterview} />}
        </main>
      </div>
    </div>
  );
}
