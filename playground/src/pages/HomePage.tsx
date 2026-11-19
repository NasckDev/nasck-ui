import { Badge } from '../../../src';
import { componentDocs } from '../docs';
import { href } from '../router';

const PILLARS = [
  {
    title: 'Tokens como fonte única',
    text: 'Cor em dois temas, tipografia, espaço, raio, sombra e movimento num só arquivo tipado, exportado para CSS.',
  },
  {
    title: 'HTML nativo antes de ARIA',
    text: 'button, input, select e label de verdade. ARIA só onde o HTML não basta: switch, tabs, dialog e tooltip.',
  },
  {
    title: 'Testado com teclado e axe',
    text: 'Cada componente tem testes de teclado e de violações axe-core, com cobertura medida no CI.',
  },
  {
    title: 'Sem dependências de runtime',
    text: 'Só React como peer dependency. Foco visível em dois tons e suporte a forced-colors e reduced-motion.',
  },
];

export function HomePage() {
  return (
    <>
      <header className="pg-hero">
        <Badge tone="accent">Design system</Badge>
        <h1 className="pg-hero__title" tabIndex={-1} id="page-title">
          Nasck UI
        </h1>
        <p className="pg-hero__lead">
          Biblioteca de componentes React acessíveis com tokens exportáveis. Esta página é a
          documentação viva: cada exemplo abaixo é renderizado pela própria biblioteca.
        </p>
        <div className="pg-hero__actions">
          <a className="pg-link-button pg-link-button--primary" href={href('/componentes/button')}>
            Ver componentes
          </a>
          <a className="pg-link-button" href={href('/tokens')}>
            Explorar tokens
          </a>
          <a className="pg-link-button" href={href('/exemplo')}>
            Exemplo composto
          </a>
        </div>
      </header>

      <section aria-labelledby="sec-pilares" className="pg-section">
        <h2 id="sec-pilares" className="pg-h2">
          Princípios
        </h2>
        <ul className="pg-grid pg-grid--2 pg-cards">
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="pg-pillar">
              <h3 className="pg-h3">{pillar.title}</h3>
              <p>{pillar.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-componentes" className="pg-section">
        <h2 id="sec-componentes" className="pg-h2">
          {componentDocs.length} componentes
        </h2>
        <ul className="pg-grid pg-grid--3 pg-cards">
          {componentDocs.map((doc) => (
            <li key={doc.slug}>
              <a className="pg-component-card" href={href(`/componentes/${doc.slug}`)}>
                <span className="pg-component-card__name">{doc.name}</span>
                <span className="pg-component-card__text">{doc.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-usar" className="pg-section">
        <h2 id="sec-usar" className="pg-h2">
          Como usar
        </h2>
        <pre
          className="pg-code__pre pg-code__pre--solo"
          tabIndex={0}
          aria-label="Exemplo de instalação"
        >
          <code>{`npm install github:NasckDev/nasck-ui

import '@nasckdev/nasck-ui/styles.css';
import { Button, ToastProvider } from '@nasckdev/nasck-ui';`}</code>
        </pre>
      </section>
    </>
  );
}
