// One button style for the whole app. variant: 'primary' | 'ghost' | 'live'
export default function Button({ variant = 'ghost', className = '', children, ...props }) {
  return (
    <button type="button" className={`btn ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
