/*
 * Cabeçalho de seção: uma régua que atravessa a página e, sob ela, índice, título
 * e uma nota curta alinhados ao grid. O elemento grande de cada seção é o conteúdo.
 */
export default function SectionHead({ index, id, title, meta }) {
  return (
    <header className="sh grid">
      <i className="sh-rule" aria-hidden="true"></i>
      <p className="lbl sh-index" aria-hidden="true">
        {index}
      </p>
      <h2 className="sh-title" id={id}>
        {title}
      </h2>
      {meta ? <p className="lbl sh-meta">{meta}</p> : null}
    </header>
  );
}
