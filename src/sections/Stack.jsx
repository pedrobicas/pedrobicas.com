import { STACK } from '../data/stack.js';
import { PROJECTS } from '../data/projects.js';
import { JOURNEY } from '../data/journey.js';
import { whereUsed } from '../utils/usage.js';
import SectionHead from '../components/SectionHead.jsx';
import { projectPath } from '../routing.js';

const slug = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const GROUPS = STACK.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ name: item, uses: whereUsed(item, PROJECTS, JOURNEY) })),
}));

function Usage({ item }) {
  return (
    <p className="stk-use" id={`uso-${slug(item.name)}`} data-for={item.name} hidden>
      <span className="stk-use-k">{item.name}</span>
      <span className="stk-use-v">
        {item.uses.map((use, index) => (
          <span key={`${use.kind}-${use.label}`}>
            {index ? (
              <span className="stk-use-sep" aria-hidden="true">
                ,{' '}
              </span>
            ) : null}
            {use.kind === 'project' ? (
              <a href={projectPath(use.slug)} data-cursor="ver">
                {use.label}
              </a>
            ) : (
              <span>{use.label}</span>
            )}
          </span>
        ))}
      </span>
    </p>
  );
}

export default function Stack() {
  const used = GROUPS.flatMap((group) => group.items.filter((item) => item.uses.length));
  return (
    <section className="stack stack-table" id="stack" aria-labelledby="stack-t">
      <SectionHead index="02" id="stack-t" title="Stack" meta="Tecnologias que uso" />
      <div className="stk grid">
        {GROUPS.map((group) => (
          <div className="stk-col" key={group.label}>
            <h3 className="lbl stk-label">
              <span>{group.label}</span>
            </h3>
            <ul className="stk-list">
              {group.items.map((item) => (
                <li key={item.name}>
                  {item.uses.length ? (
                    <button
                      type="button"
                      className="stk-item"
                      data-tech={item.name}
                      aria-pressed="false"
                      aria-describedby={`uso-${slug(item.name)}`}
                    >
                      <span className="stk-name">{item.name}</span>
                    </button>
                  ) : (
                    <span className="stk-item is-plain">
                      <span className="stk-name">{item.name}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="stk-readout">
        <p className="stk-hint lbl">
          Passe o mouse ou toque numa tecnologia para ver onde ela aparece nos projetos e na trajetória. Clique para
          fixar; Esc para limpar.
        </p>
        {used.map((item) => (
          <Usage item={item} key={item.name} />
        ))}
      </div>
    </section>
  );
}
