// Page title bar shown above every page.
export default function Header({ title, subtitle }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="lede">{subtitle}</p>}
      </div>
      <span className="local-pill" title="There is no server. Everything runs in your browser.">Runs in your browser</span>
    </header>
  );
}
