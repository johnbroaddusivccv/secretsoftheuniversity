export default function GateLink({ href, name, desc, color }) {
  return (
    <a className="gate" href={href} target="_blank" rel="noopener noreferrer">
      <span className="gate-dot" style={{ background: color }} />
      <div className="gate-info">
        <div className="gate-name">{name}</div>
        <div className="gate-desc">{desc}</div>
      </div>
    </a>
  );
}
