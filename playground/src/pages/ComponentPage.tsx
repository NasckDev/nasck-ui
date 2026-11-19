import { Badge } from '../../../src';
import { CodeBlock } from '../CodeBlock';
import type { ComponentDoc } from '../docs/types';

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <>
      <header className="pg-page-head">
        <p className="pg-eyebrow">{doc.group}</p>
        <h1 className="pg-h1" tabIndex={-1} id="page-title">
          {doc.name}
        </h1>
        <p className="pg-lead">{doc.summary}</p>
        <p className="pg-semantics">
          <Badge tone="accent">Semântica</Badge> <span>{doc.semantics}</span>
        </p>
      </header>

      <section aria-labelledby="sec-exemplos" className="pg-section">
        <h2 id="sec-exemplos" className="pg-h2">
          Estados e exemplos
        </h2>
        {doc.demos.map((demo) => (
          <article key={demo.title} className="pg-demo">
            <h3 className="pg-h3">{demo.title}</h3>
            {demo.note ? <p className="pg-note">{demo.note}</p> : null}
            <div className="pg-preview">{demo.preview}</div>
            <CodeBlock code={demo.code} label={`${doc.name}, ${demo.title}`} />
          </article>
        ))}
      </section>

      <section aria-labelledby="sec-a11y" className="pg-section">
        <h2 id="sec-a11y" className="pg-h2">
          Acessibilidade
        </h2>
        <h3 className="pg-h3">Teclado</h3>
        <div className="pg-table-wrap" role="region" aria-label="Atalhos de teclado" tabIndex={0}>
          <table className="pg-table">
            <thead>
              <tr>
                <th scope="col">Tecla</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              {doc.keyboard.map((row) => (
                <tr key={row.keys}>
                  <th scope="row">
                    <kbd>{row.keys}</kbd>
                  </th>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="pg-h3">ARIA e semântica</h3>
        <ul className="pg-list">
          {doc.aria.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-props" className="pg-section">
        <h2 id="sec-props" className="pg-h2">
          API
        </h2>
        <div className="pg-table-wrap" role="region" aria-label="Props principais" tabIndex={0}>
          <table className="pg-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Tipo</th>
                <th scope="col">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {doc.props.map((prop) => (
                <tr key={prop.name}>
                  <th scope="row">
                    <code>{prop.name}</code>
                  </th>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
