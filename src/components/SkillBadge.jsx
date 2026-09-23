const LABELS = { verified: 'Verified', studying: 'Studying', new: 'Not started' };

// Small pill. variant: 'found' | 'missing' (keywords) or 'verified' | 'studying' | 'new' (learning status)
export default function SkillBadge({ variant = 'new', children }) {
  return <span className={`pill ${variant}`}>{children || LABELS[variant]}</span>;
}
