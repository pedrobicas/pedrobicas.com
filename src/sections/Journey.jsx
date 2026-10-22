import { JOURNEY } from '../data/journey.js';
import Tags from '../components/Tags.jsx';

export default function Journey() {
  return (
    <section className="journey" id="trajetoria" aria-labelledby="traj-t">
      <div className="journey-grid">
        <div className="journey-side">
          <p className="path" aria-hidden="true">
            ~/trajetoria
          </p>
          <h2 className="sec-title" id="traj-t" data-split>
            Trajetória
          </h2>
          <div className="year" aria-hidden="true">
            <span className="year-num">2021</span>
          </div>
          <p className="year-cap" aria-hidden="true">
            SENAI
          </p>
        </div>
        <div className="journey-body">
          <svg className="journey-line" aria-hidden="true">
            <path className="jl-base"></path>
            <path className="jl-draw"></path>
          </svg>
          <ol className="journey-list">
            {JOURNEY.map((item) => (
              <li className="milestone" data-year={item.year} data-cap={item.cap} key={item.when}>
                <p className="ms-when">
                  <span>{item.when}</span>
                  <span className="ms-kind">{item.kind}</span>
                </p>
                <h3 className="ms-title">{item.title}</h3>
                <p className="ms-org">{item.org}</p>
                <p className="ms-desc">{item.desc}</p>
                <ul className="ms-points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Tags items={item.tags} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
