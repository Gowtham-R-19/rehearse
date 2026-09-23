// Rounded white panel. Optional title.
export default function Card({ title, className = '', children, ...props }) {
  return (
    <section className={`card ${className}`.trim()} {...props}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </section>
  );
}
