import { tone } from '../utils/scoring.js';

// Big number score with a title and short text next to it.
export default function ScoreCard({ score, title, text }) {
  return (
    <div className="scorehead">
      <div className={`score-ring ${tone(score)}`}>
        <span className="big">{score}</span>
        <span className="of">out of 100</span>
      </div>
      <div>
        <h2>{title}</h2>
        <p className="lede">{text}</p>
      </div>
    </div>
  );
}
