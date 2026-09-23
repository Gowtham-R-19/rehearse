# Rehearse — Resume Review & Mock Interview Coach

Rehearse helps IT students and freshers improve their resume and practise interviews for IT roles, all in the browser.

**Flow:** Resume → Analyze → Find what's missing → Learn → Practice → Mock interview → Feedback / Report

## What Rehearse does

1. You upload a PDF (or paste text) and pick a target role.
2. Rehearse scores the resume and comments on individual lines.
3. It lists role keywords that are missing and links to free learning resources, with a short quiz for each.
4. It runs a mock interview (introduction, questions from your resume, technical and behavioral questions).
5. It gives feedback on each answer and a final report with scores and next steps.

## Main features

- Resume upload (PDF, read in the browser) or paste text, plus a sample resume
- Resume score (contact details, structure, role keywords, impact of bullets, length)
- Strengths, things to fix, things to add, and line-by-line comments
- 7 built-in roles plus a custom role
- "Learn what's missing" with resources and 2-question checks (progress saved in this browser)
- Mock interview with typed or voice answers (browser speech service, if supported)
- STAR-style checks for behavioral answers, filler-word / hedging / pace feedback
- Report with scores, attempt history, resources and a downloadable updated resume (.txt)
- Optional on-device AI (WebLLM, needs WebGPU, ~1 GB download) for extra written feedback

## Technology stack

- React 18 + Vite 5
- Plain CSS (`src/index.css`)
- pdf.js (`pdfjs-dist`) to read PDFs
- No backend, no database, no login

## Project structure

```
rehearse/
├── public/                  favicon
├── src/
│   ├── components/          small reusable UI pieces
│   │   ├── Sidebar.jsx  Header.jsx  Button.jsx  Card.jsx
│   │   ├── ScoreCard.jsx  ScoreChip.jsx  SkillBadge.jsx
│   │   └── ProgressBar.jsx  ResourceList.jsx
│   ├── pages/               one file per screen
│   │   ├── Dashboard.jsx  ResumeReview.jsx  Learning.jsx
│   │   └── MockInterview.jsx  Report.jsx
│   ├── data/                plain data, no logic
│   │   ├── roles.js         roles + resume keywords
│   │   ├── questions.js     interview question bank
│   │   ├── resources.js     learning links + skill→topic rules
│   │   ├── quizData.js      quiz questions
│   │   └── sampleResume.js  demo resume
│   ├── services/            the "brains" (swap these for AI later)
│   │   ├── resumeAnalysis.js     local resume analysis
│   │   ├── interviewAnalysis.js  question building + answer evaluation
│   │   ├── pdfReader.js          PDF → text
│   │   └── onDeviceAI.js         optional in-browser AI
│   ├── utils/
│   │   ├── scoring.js  textUtils.js  helpers.js
│   ├── App.jsx              holds app state, connects pages
│   ├── main.jsx             entry point
│   └── index.css            all styles
├── index.html
├── package.json
└── README.md
```

Rule of thumb: **pages show things, services decide things, data is just data.**

## How to install

You need [Node.js](https://nodejs.org) (version 18 or newer, the LTS version is fine).

```powershell
node -v
npm install
```

## How to run

```powershell
npm run dev
```

Open the address it prints (usually http://localhost:5173). Stop it with `Ctrl + C`.

To check a production build: `npm run build`.

## Current prototype limitations

- Resume analysis, scoring, question selection and answer evaluation are **local and rule-based** (regex and keyword matching). They are not AI.
- Interview questions are **predefined**; only the project/skill questions use words from your resume.
- A custom role borrows keywords and questions from the closest built-in role.
- Keyword matching can miss synonyms and can be fooled by keyword stuffing.
- Scores are guidance, not a prediction of real interview results.
- Voice input uses your browser's speech service, which may send audio online. Typing keeps everything on your device.
- The optional on-device AI uses a small model, so its feedback can be generic or wrong.

## Future AI integration

The code is split so AI can be added without redesigning the app:

| Today (local) | Later (AI) |
| --- | --- |
| `services/resumeAnalysis.js` → `analyze()` | AI resume analysis (keep the same return shape) |
| `services/interviewAnalysis.js` → `buildQuestions()` | Personalised questions from role, resume, skills and projects |
| `services/interviewAnalysis.js` → `evaluate()` | AI answer evaluation and follow-up questions |
| `data/resources.js` | AI learning recommendations |

If you call a paid AI API, put the call behind a small backend so the API key is never shipped to the browser.

## Git commands

```powershell
git init
git add .
git commit -m "Initial Rehearse prototype"
git remote add origin <MY_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
git status
```
