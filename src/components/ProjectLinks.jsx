export default function ProjectLinks({ links }) {
  return links.map((link) => (
    <a
      key={`${link.label}-${link.href}`}
      className={`pill${link.demo ? ' solid' : ''}`}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor={link.demo ? 'demo' : 'código'}
      data-magnetic=".25"
    >
      {link.label}
    </a>
  ));
}
