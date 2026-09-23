import { tone } from '../utils/scoring.js';

// Compact "72 Communication" chip used in interview feedback and the report.
export default function ScoreChip({ label, value }) {
  return <span className={`chip ${tone(value)}`}><b>{value}</b> {label}</span>;
}
