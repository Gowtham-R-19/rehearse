// LOCAL / RULE-BASED resume analysis (no AI). Input: resume text + role object. Output: score, comments, keywords.
// Later: keep the same return shape and swap the body for an AI call.
import { has, words } from '../utils/textUtils.js';

const HEAD_RE = /^(summary|professional summary|objective|career objective|profile|about me|education|academic background|skills|technical skills|key skills|projects?|academic projects?|personal projects?|experience|work experience|professional experience|internships?|internship experience|certifications?|courses|achievements|awards|extracurricular activities|languages|interests|hobbies)$/i;
const VERBS = 'built|developed|designed|implemented|created|led|managed|reduced|improved|increased|optimized|optimised|automated|deployed|launched|analyzed|analysed|integrated|migrated|wrote|tested|resolved|fixed|delivered|organized|organised|configured|engineered|conducted|trained|achieved|won|secured|refactored|debugged|maintained|collaborated|presented|mentored|monitored|streamlined|generated|processed|visualized|coordinated|prepared|supported|documented|installed|troubleshot|administered|cut|saved|shipped';
const VERB_RE = new RegExp('^(?:' + VERBS + ')\\b', 'i');
const WEAK_RE = /\b(responsible for|worked on|helped(?: in| with)?|involved in|assisted in|hard[- ]?working|team player|good communication skills|quick learner|detail[- ]oriented|passionate about|duties included|tasked with)\b/i;
function secKey(h) {
  h = h.toLowerCase();
  if (/summary|objective|profile|about/.test(h)) return 'summary';
  if (/educat|academic background/.test(h)) return 'education';
  if (/skill/.test(h)) return 'skills';
  if (/project/.test(h)) return 'projects';
  if (/experience|intern/.test(h)) return 'experience';
  if (/certif|course/.test(h)) return 'certs';
  return 'other';
}
export function parseResume(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const sections = {}; let cur = 'header'; const out = [];
  for (const t of lines) {
    const clean = t.replace(/[^A-Za-z ]/g, '').trim();
    if (t.length <= 40 && HEAD_RE.test(clean)) { cur = secKey(clean); out.push({ t, sec: cur, head: true }); continue; }
    (sections[cur] = sections[cur] || []).push(t);
    const bulletChar = /^[-•*▪◦●–·]\s*/.test(t);
    const body = t.replace(/^[-•*▪◦●–·]\s*/, '');
    const wc = words(body);
    const inWork = cur === 'projects' || cur === 'experience';
    const bullet = inWork && (bulletChar || (wc >= 8 && !/\b(19|20)\d{2}\b/.test(body)));
    out.push({ t, body, sec: cur, bullet, wc });
  }
  const projects = out.filter(l => l.sec === 'projects' && !l.head && !l.bullet && l.wc <= 9).map(l => l.t);
  return { lines: out, sections, projects };
}
export function analyze(text, role) {
  const p = parseResume(text), low = text.toLowerCase(), wc = words(text);
  const email = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  const phone = (text.match(/\+?\d[\d\s().-]{8,}\d/g) || []).some(m => { const d = m.replace(/\D/g, '').length; return d >= 10 && d <= 13; });
  const li = /linkedin\.com/i.test(text), gh = /github\.com/i.test(text);
  const sec = k => !!(p.sections[k] && p.sections[k].length);
  const kwFound = role.kw.filter(([, a]) => has(low, a)), kwMissing = role.kw.filter(([, a]) => !has(low, a));
  const bullets = p.lines.filter(l => l.bullet);
  const numFrac = bullets.length ? bullets.filter(l => /\d/.test(l.body)).length / bullets.length : 0;
  const verbFrac = bullets.length ? bullets.filter(l => VERB_RE.test(l.body)).length / bullets.length : 0;
  const weakCount = p.lines.filter(l => !l.head && WEAK_RE.test(l.t) && (l.bullet || l.sec === 'summary')).length;
  const unq = bullets.filter(l => !/\d/.test(l.body)).length;

  // line-by-line review
  let goodShown = 0, good = 0;
  const items = p.lines.map(l => {
    if (l.head) return { t: l.t, head: true };
    const c = []; const weak = WEAK_RE.exec(l.t);
    if (l.bullet) {
      if (weak) c.push({ k: 'bad', m: '“' + weak[0] + '” is vague. Say what you did with a verb (Built, Designed, Reduced) and what changed.' });
      else if (!VERB_RE.test(l.body)) c.push({ k: 'warn', m: 'Start with an action verb, such as Built, Automated, or Reduced.' });
      if (!/\d/.test(l.body)) c.push({ k: 'warn', m: 'No numbers. Add scale or impact: users, % faster, hours saved, tests written.' });
      if (!c.length) { good++; if (goodShown < 3) { goodShown++; c.push({ k: 'good', m: 'Strong: starts with an action and shows a result.' }); } }
    } else if (l.sec === 'summary' && weak) {
      c.push({ k: 'bad', m: '“' + weak[0] + '” is a cliché. Replace it with a specific skill or result.' });
    }
    return { t: l.t, c };
  });

  const contact = (email ? 4 : 0) + (phone ? 3 : 0) + (li ? 1.5 : 0) + (gh ? 1.5 : 0);
  const structure = (sec('education') ? 5 : 0) + (sec('skills') ? 5 : 0) + ((sec('projects') || sec('experience')) ? 6 : 0) + (sec('summary') ? 2 : 0) + (sec('certs') ? 2 : 0);
  const keywords = Math.min(1, kwFound.length / 8) * 25;
  const impact = bullets.length ? 16 * numFrac + 12 * verbFrac + 7 * (1 - Math.min(1, weakCount / 3)) : 0;
  const length = (wc >= 250 && wc <= 700) ? 10 : ((wc >= 150 && wc < 250) || (wc > 700 && wc <= 900)) ? 6 : 2;
  const cats = [
    { name: 'Contact details', pts: contact, max: 10, note: [!email && 'email', !phone && 'phone', !li && 'LinkedIn', !gh && 'GitHub'].filter(Boolean).length ? 'Missing: ' + [!email && 'email', !phone && 'phone', !li && 'LinkedIn', !gh && 'GitHub'].filter(Boolean).join(', ') : '' },
    { name: 'Structure', pts: structure, max: 20, note: '' },
    { name: 'Role keywords', pts: keywords, max: 25, note: kwFound.length + ' of ' + role.kw.length + ' found' },
    { name: 'Impact of bullets', pts: impact, max: 35, note: bullets.length ? Math.round(numFrac * 100) + '% of bullets have numbers' : 'No bullet points found' },
    { name: 'Length', pts: length, max: 10, note: wc + ' words' }
  ];
  const score = Math.round(cats.reduce((s, c) => s + c.pts, 0));

  const strengths = [], weaknesses = [], opps = [];
  if (contact >= 8.5) strengths.push('Contact details are complete.');
  const present = [['Education', 'education'], ['Skills', 'skills'], ['Projects', 'projects'], ['Experience', 'experience'], ['Certifications', 'certs']].filter(([, k]) => sec(k)).map(([n]) => n);
  if (present.length >= 3) strengths.push('Clear sections: ' + present.join(', ') + '.');
  if (kwFound.length >= 5) strengths.push(kwFound.length + ' role keywords found, including ' + kwFound.slice(0, 4).map(k => k[0]).join(', ') + '.');
  if (bullets.length && numFrac >= 0.5) strengths.push('Most bullets include numbers.');
  if (good) strengths.push(good + ' bullet' + (good > 1 ? 's' : '') + ' pair an action with a result.');
  if (!strengths.length) strengths.push('You have a starting point to build on.');
  const missingContact = [!email && 'email', !phone && 'phone number'].filter(Boolean);
  if (missingContact.length) weaknesses.push('No ' + missingContact.join(' or ') + ' found. Recruiters and ATS need it.');
  const missingSec = [['Education', 'education'], ['Skills', 'skills']].filter(([, k]) => !sec(k)).map(([n]) => n);
  if (!sec('projects') && !sec('experience')) missingSec.push('Projects or Experience');
  if (missingSec.length) weaknesses.push('Missing sections: ' + missingSec.join(', ') + '. Use standard headings.');
  if (!bullets.length) weaknesses.push('No bullet points found under Projects or Experience. Describe each project in 2 to 3 bullets.');
  if (weakCount) weaknesses.push(weakCount + ' vague phrase' + (weakCount > 1 ? 's' : '') + ' (like “worked on” or “responsible for”).');
  if (unq) weaknesses.push(unq + ' of ' + bullets.length + ' bullets have no numbers.');
  if (wc < 150) weaknesses.push('Resume looks short (' + wc + ' words). Add project details.');
  if (wc > 900) weaknesses.push('Resume is long (' + wc + ' words). Aim for one page if you are a fresher.');
  if (!weaknesses.length) weaknesses.push('No major problems found. Read each line once more for typos.');
  if (kwMissing.length) opps.push('Add these only if you have really used them: ' + kwMissing.slice(0, 6).map(k => k[0]).join(', ') + '.');
  if (!gh) opps.push('Add a GitHub or portfolio link so reviewers can see your work.');
  opps.push('Use one column, standard headings, and export as PDF. ATS software often misreads tables and icons.');
  opps.push('Tailor the summary to the ' + role.label + ' role in one or two lines.');
  return { score, cats, strengths, weaknesses, opps, kwFound, kwMissing, items, projects: p.projects, wc };
}
