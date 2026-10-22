export default function ProjectCaptures({ project }) {
  const media = project?.media;
  if (!media?.shots?.length) return null;
  return (
    <section className="project-captures" aria-label={`Capturas de ${project.name}`}>
      <h3>Aplicação em uso</h3>
      {media.note ? <p className="project-captures-note">{media.note}</p> : null}
      <div className="project-captures-grid">
        {media.shots.map((shot) => (
          <figure className={shot.mobile ? 'capture-mobile' : undefined} key={shot.src}>
            <a href={shot.src} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${shot.caption}`}>
              <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.caption}
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption>{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
