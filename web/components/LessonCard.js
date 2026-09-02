import Link from 'next/link';

export default function LessonCard({ department, title, teaser, slug }) {
  return (
    <div className="lesson">
      <div className="lesson-dept">{department}</div>
      <h3>{title}</h3>
      <p>{teaser}</p>
      {slug ? (
        <Link href={`/lessons/${slug}`} className="lesson-link">
          Seek →
        </Link>
      ) : (
        <span className="lesson-link" style={{ opacity: 0.5, cursor: 'default' }}>
          Coming soon
        </span>
      )}
    </div>
  );
}
