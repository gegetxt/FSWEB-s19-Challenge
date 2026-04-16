export default function SectionCard({ eyebrow, title, subtitle, children }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <span className="section-label">{eyebrow}</span>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
