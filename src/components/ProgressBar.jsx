import { tone } from '../utils/scoring.js';

// Labelled bar. Colour changes with the percentage (green / amber / red).
export default function ProgressBar({ label, value, max = 100, note }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="meter">
      <div className="meter-top">
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div className="track"><i className={tone(pct)} style={{ width: pct + '%' }} /></div>
      {note ? <p className="hint">{note}</p> : null}
    </div>
  );
}
