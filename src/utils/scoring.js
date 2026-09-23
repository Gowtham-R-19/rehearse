// Score colours + report calculations. Same numbers and rules as the original prototype.
import { avg } from './helpers.js';
import { TOPIC_RES } from '../data/resources.js';

// Colour bucket for a 0-100 score: g(reen) / w(arn) / b(ad)
export const tone = n => n >= 70 ? 'g' : n >= 45 ? 'w' : 'b';

export const verdictFor = score =>
  score >= 80 ? 'Strong. Polish the last few lines and start applying.'
  : score >= 60 ? 'Solid base. The highlighted lines are the fastest way to improve.'
  : 'Needs work before you apply. Start with the highlighted lines.';

export const NAMES = { resume: 'Resume', comm: 'Communication', conf: 'Confidence', tech: 'Technical knowledge', struct: 'Answer structure' };

export const TIPS = {
  comm: ['Aim for 40 to 150 words per answer, about 30 to 60 seconds.', 'Replace filler words with a short pause.', 'Answer first, then explain: lead with the main point.'],
  conf: ['State answers directly: \u201CI would use\u2026\u201D instead of \u201CI think maybe\u2026\u201D.', 'Use \u201CI\u201D for what you did in projects and teams.', 'Practise out loud twice before each real interview.'],
  tech: ['Revise the topics in the resources below, then re-answer the questions you missed.', 'For each concept, prepare a one-line definition, a use case, and a trade-off.'],
  struct: ['Use STAR: Situation, Task, Action, Result. End with a number or a lesson.', 'Prepare a 45-second introduction: education, skills, best project, goal.'],
  resume: ['Fix the highlighted lines in your resume review, especially vague phrases and missing numbers.', 'Add missing keywords only if you have really used them.']
};

// Average the interview results into the five report scores.
export function computeScores(results, resumeScore) {
  const R = results.filter(Boolean);
  const techR = R.filter(r => r.q.type === 'tech' || r.q.type === 'resume');
  const strR = R.filter(r => r.q.type === 'intro' || r.q.type === 'behav');
  const S = {
    resume: resumeScore,
    comm: avg(R.map(r => r.comm)),
    conf: avg(R.map(r => r.conf)),
    tech: techR.length ? avg(techR.map(r => r.content)) : null,
    struct: strR.length ? avg(strR.map(r => r.content)) : null
  };
  Object.keys(S).forEach(k => { if (S[k] !== null) S[k] = Math.round(S[k]); });
  const keys = Object.keys(S).filter(k => S[k] !== null);
  const weakest = keys.reduce((m, k) => S[k] < S[m] ? k : m, keys[0]);
  return { S, R, techR, keys, weakest };
}

// Which resource ids to recommend in the report (max 6)
export function pickReportResources(techR, analysis, role) {
  const ids = [];
  techR.filter(r => r.content < 70).forEach(r => {
    (r.q.topic === 'starter' ? role.starter : TOPIC_RES[r.q.topic] || []).forEach(i => { if (!ids.includes(i)) ids.push(i); });
  });
  if (analysis.cats[2].pts / analysis.cats[2].max < 0.7) role.starter.forEach(i => { if (!ids.includes(i)) ids.push(i); });
  return ids.slice(0, 6);
}
