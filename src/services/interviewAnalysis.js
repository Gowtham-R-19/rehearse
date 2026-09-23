// LOCAL / RULE-BASED interview logic (no AI): builds the question list and scores answers.
// Later: replace buildQuestions() with AI-generated, resume-specific questions and evaluate() with an AI evaluator.
// Keep the same shapes: questions = [{ type, topic, text, expect }], result = { comm, conf, content, hits, ... }.
import { INTRO, BEHAV, STAR, TYPE_LABEL } from '../data/questions.js';
import { has, words, cut } from '../utils/textUtils.js';
import { clamp, shuffle, uid } from '../utils/helpers.js';

export function buildQuestions(a, role) {
  const qs = [INTRO];
  if (a.projects[0]) {
    qs.push({ type:'resume', topic:'starter', text:'Walk me through your project “' + cut(a.projects[0], 60) + '”. What problem did it solve, and what exactly was your part?',
      expect:[['Problem','problem|goal|purpose|objective'],['Your role','my role|i built|i developed|i implemented|i designed|i created|i wrote'],['Tech used','tech|stack|used|using'],['Challenge','challenge|difficult|issue|bug'],['Result','result|outcome|improv|learn|deployed']] });
  } else {
    qs.push({ type:'resume', topic:'starter', text:'Tell me about the project you are most proud of. What problem did it solve, and what was your part?',
      expect:[['Problem','problem|goal|purpose|objective'],['Your role','my role|i built|i developed|i implemented|i designed|i created|i wrote'],['Tech used','tech|stack|used|using'],['Challenge','challenge|difficult|issue|bug'],['Result','result|outcome|improv|learn|deployed']] });
  }
  const techs = shuffle(role.tech);
  const skill = shuffle(a.kwFound)[0];
  if (skill) {
    qs.push({ type:'resume', topic:'starter', text:'Your resume lists ' + skill[0] + '. Describe where you used it and one thing that went wrong or surprised you.',
      expect:[['Where you used it','used|built|project|implemented'],['What went wrong','problem|issue|bug|error|challenge|surprise|wrong'],['What you learned','learn|fix|solved|resolved|debug|improved']] });
  } else qs.push(techs.pop());
  qs.push(techs.pop(), techs.pop());
  qs.push({ type:'behav', topic:'comm', text: BEHAV[Math.floor(Math.random() * BEHAV.length)], expect: STAR });
  return qs;
}
const FILL_RE = /\b(?:um+|uh+|erm|you know|basically|literally|i mean|actually)\b/gi;
const HEDGE_RE = /\b(?:maybe|i think|i guess|kind of|sort of|not sure|probably|i don't know|i dont know|might be|perhaps|somewhat)\b/gi;
const OWN_RE = /\bI (?:built|designed|developed|created|led|implemented|fixed|wrote|managed|solved|used|decided|tested|deployed|analy[sz]ed|organi[sz]ed|worked|handled|configured)\b/gi;
export function evaluate(q, text, wpm) {
  const wc = words(text);
  const fillers = (text.match(FILL_RE) || []).length, hedges = (text.match(HEDGE_RE) || []).length, own = (text.match(OWN_RE) || []).length;
  let comm = wc < 15 ? 30 : wc < 40 ? 55 : wc <= 170 ? 85 : 72;
  comm -= Math.min(20, fillers * 4);
  if (wpm && (wpm < 100 || wpm > 180)) comm -= 8;
  let conf = 78 - Math.min(35, hedges * 7) - Math.min(15, fillers * 3) + Math.min(15, own * 5);
  if (wc < 15) conf -= 20;
  if (wpm && wpm < 90) conf -= 8;
  const hits = q.expect.map(([l, a]) => ({ l, ok: has(text, a) }));
  const need = Math.max(3, Math.ceil(q.expect.length * 0.75));
  const content = clamp(Math.round(100 * Math.min(1, hits.filter(h => h.ok).length / need)));
  return { wc, fillers, hedges, own, wpm, comm: clamp(comm), conf: clamp(conf), content, hits };
}

// Chat message announcing a question
export function questionMessage(q) {
  return { id: uid(), kind: 'bot', text: q.text, tag: TYPE_LABEL[q.type] };
}

// Creates a fresh interview session object (state lives in App.jsx)
export function createInterview(analysis, role) {
  const qs = buildQuestions(analysis, role);
  return {
    qs, i: 0, results: [], buf: '', followed: false, reported: false, phase: 'answer',
    messages: [
      { id: uid(), kind: 'bot', text: 'Hi, I\u2019m your interviewer for the ' + role.label + ' role. I will ask questions based on your resume. Answer as you would in a real interview.' },
      questionMessage(qs[0])
    ]
  };
}

// Coaching tips shown under each evaluated answer
export function getFeedbackTips(r) {
  const q = r.q, tech = q.type === 'tech' || q.type === 'resume';
  const got = r.hits.filter(h => h.ok).map(h => h.l), miss = r.hits.filter(h => !h.ok).map(h => h.l);
  const tips = [];
  if (got.length) tips.push('Covered: ' + got.join(', ') + '.');
  if (miss.length) tips.push((tech ? 'Not mentioned: ' : 'Add: ') + miss.join(', ') + '.' + (q.type === 'behav' ? ' Use STAR: Situation, Task, Action, Result.' : ''));
  if (r.fillers > 2) tips.push('You used ' + r.fillers + ' filler words. Pause silently instead.');
  if (r.wc < 40) tips.push('Short answer. Aim for 40 to 150 words, about 30 to 60 seconds.');
  if (r.wc > 170) tips.push('Long answer. Lead with the main point, then add one example.');
  if (r.hedges > 1) tips.push('Phrases like \u201cI think\u201d and \u201cmaybe\u201d make you sound unsure. State it directly.');
  if (r.own === 0 && (q.type === 'behav' || q.type === 'resume')) tips.push('Say what you did: \u201cI built\u2026\u201d, \u201cI fixed\u2026\u201d. Interviewers hire individuals, not teams.');
  if (r.wpm) tips.push('Speaking pace: about ' + r.wpm + ' words per minute. Aim for 120 to 160.');
  return tips;
}
