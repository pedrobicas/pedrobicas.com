import React from 'react';
import { STACK } from '../data/stack.js';

function Separator() {
  return <svg className="mq-sep" viewBox="0 0 40 20" aria-hidden="true"><path d="M0 15H9V5H18V15H24V5H29V15H40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" strokeLinecap="square" /></svg>;
}

export default function Stack() {
  return (
    <section className="stack" id="stack" aria-labelledby="stack-t">
      <div className="sec-head">
        <div><p className="path" aria-hidden="true">~/stack</p><h2 className="sec-title" id="stack-t" data-split>Stack</h2></div>
        <p className="sec-note">O que eu uso para levar uma ideia do banco de dados até a tela.</p>
      </div>
      <ul className="sr-only" id="stack-list">{STACK.map((group) => <li key={group.label}>{group.label}: {group.items.join(', ')}</li>)}</ul>
      <div className="marquees" aria-hidden="true">
        {STACK.map((group) => (
          <div className="mq" key={group.label}>
            <span className="mq-label">{group.label}</span>
            <div className="mq-track"><div className="mq-group">{group.items.map((item) => <React.Fragment key={item}><span className="mq-item">{item}</span><Separator /></React.Fragment>)}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}
