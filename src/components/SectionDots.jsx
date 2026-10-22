import { SECTION_LINKS } from '../data/site.js';

export default function SectionDots() {
  return (
    <nav className="dots" aria-label="Seções da página">
      {SECTION_LINKS.map(([id, label]) => (
        <a key={id} href={`#${id}`}>
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
