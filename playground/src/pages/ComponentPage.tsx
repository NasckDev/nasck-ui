import { Check, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Badge, Select, Skeleton, Switch, TextField } from '../../../src';
import { CodeBlock } from '../components/CodeBlock';
import { buildSnippet } from '../lib/snippet';
import { defaultValues } from '../lib/codegen';
import type { DocMeta } from '../docs';
import type { ComponentDoc, Control, ControlValues, Tip } from '../docs/types';
import { iconFor } from '../nav';
import '../styles/component.css';

const SECTIONS = [
  { id: 'playground', label: 'Playground' },
  { id: 'variacoes', label: 'Variações' },
  { id: 'anatomia', label: 'Anatomia' },
  { id: 'acessibilidade', label: 'Teclado e ARIA' },
  { id: 'praticas', label: 'Faça e não faça' },
  { id: 'api', label: 'API' },
] as const;

function ControlField({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  if (control.kind === 'select') {
    return (
      <Select
        label={control.name}
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        options={control.options.map((option) => ({ value: option, label: option }))}
      />
    );
  }
  if (control.kind === 'boolean') {
    return <Switch label={control.name} checked={Boolean(value)} onCheckedChange={onChange} />;
  }
  return (
    <TextField
      label={control.name}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function PlaygroundSection({ doc }: { doc: ComponentDoc }) {
  const playground = doc.playground;
  const [values, setValues] = useState<ControlValues>(() =>
    defaultValues(playground?.controls ?? []),
  );
  if (!playground) return null;
  const update = (name: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [name]: value }));

  return (
    <div className="pg-playground">
      <div
        className="pg-playground__stage"
        role="region"
        aria-label={`Prévia interativa: ${doc.name}`}
      >
        <div className="pg-playground__preview">{playground.render(values)}</div>
      </div>
      <form
        className="pg-playground__panel"
        aria-label="Propriedades"
        onSubmit={(event) => event.preventDefault()}
      >
        <h3 className="pg-panel-title">Propriedades</h3>
        {playground.controls.map((control) => (
          <ControlField
            key={control.name}
            control={control}
            value={values[control.name] ?? control.default}
            onChange={(value) => update(control.name, value)}
          />
        ))}
        <button
          type="button"
          className="pg-link-button nui-focusable"
          onClick={() => setValues(defaultValues(playground.controls))}
        >
          Restaurar padrões
        </button>
      </form>
      <div className="pg-playground__code">
        <CodeBlock
          code={buildSnippet({ code: playground.code(values), setup: playground.setup?.(values) })}
          label={`${doc.name}, gerado pelo playground`}
        />
      </div>
    </div>
  );
}

function AnatomySection({ doc }: { doc: ComponentDoc }) {
  const parts = useMemo(() => doc.anatomy ?? [], [doc.anatomy]);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const stage: ReactNode = useMemo(
    () =>
      doc.anatomyStage ??
      (doc.playground
        ? doc.playground.render(defaultValues(doc.playground.controls))
        : doc.demos[0]?.preview),
    [doc],
  );

  useEffect(() => {
    const part = active === null ? undefined : parts[active];
    if (!part || !stageRef.current) return undefined;
    const nodes = Array.from(stageRef.current.querySelectorAll<HTMLElement>(part.selector));
    nodes.forEach((node) => node.classList.add('pg-anat-hl'));
    return () => nodes.forEach((node) => node.classList.remove('pg-anat-hl'));
  }, [active, parts]);

  if (parts.length === 0) return null;
  return (
    <div className="pg-anatomy">
      <div ref={stageRef} className="pg-anatomy__stage" aria-hidden="true" inert>
        {stage}
      </div>
      <ol className="pg-anatomy__legend">
        {parts.map((part, index) => (
          <li key={part.label}>
            <button
              type="button"
              className="pg-anatomy__item nui-focusable"
              data-active={active === index}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
            >
              <span className="pg-anatomy__num" aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <strong>{part.label}</strong>
                <span className="pg-anatomy__desc">{part.description}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TipList({ tips, kind }: { tips: readonly Tip[]; kind: 'do' | 'dont' }) {
  const headingId = useId();
  const Icon = kind === 'do' ? Check : X;
  return (
    <section className="pg-tips" data-kind={kind} aria-labelledby={headingId}>
      <h3 id={headingId} className="pg-tips__title">
        <Icon size={18} aria-hidden="true" />
        {kind === 'do' ? 'Faça' : 'Não faça'}
      </h3>
      <ul className="pg-tips__list">
        {tips.map((tip) => (
          <li key={tip.text}>
            <p>{tip.text}</p>
            {tip.code ? <code className="pg-tips__code">{tip.code}</code> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`sec-${id}`} className="pg-section" id={id}>
      <h2 id={`sec-${id}`} className="pg-h2" tabIndex={-1}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ComponentPage({ meta, doc }: { meta: DocMeta; doc: ComponentDoc | undefined }) {
  const Icon = iconFor(meta.slug);
  const available = doc
    ? SECTIONS.filter((section) => {
        if (section.id === 'playground') return Boolean(doc.playground);
        if (section.id === 'anatomia') return Boolean(doc.anatomy?.length);
        if (section.id === 'praticas') return Boolean(doc.dos?.length || doc.donts?.length);
        return true;
      })
    : [];

  // The heading is the same element while the docs chunk loads, so focus set on navigation stays.
  return (
    <>
      <header className="pg-page-head">
        <p className="pg-eyebrow">
          <Icon size={14} aria-hidden="true" /> {meta.group}
        </p>
        <h1 className="pg-h1" tabIndex={-1} id="page-title">
          {meta.name}
        </h1>
        <p className="pg-lead">{meta.summary}</p>
        {doc ? (
          <p className="pg-semantics">
            <Badge tone="accent">Semântica</Badge> <span>{doc.semantics}</span>
          </p>
        ) : null}
        {doc ? (
          <nav aria-label="Nesta página" className="pg-toc">
            {available.map((section) => (
              <a
                key={section.id}
                href={`#/componentes/${meta.slug}`}
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(section.id)?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'auto'
                      : 'smooth',
                    block: 'start',
                  });
                  document.getElementById(`sec-${section.id}`)?.focus({ preventScroll: true });
                }}
              >
                {section.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>
      {doc ? (
        <ComponentBody doc={doc} />
      ) : (
        <div data-route-loading aria-busy="true">
          <Skeleton lines={4} />
        </div>
      )}
    </>
  );
}

function ComponentBody({ doc }: { doc: ComponentDoc }) {
  return (
    <>
      {doc.playground ? (
        <Section id="playground" title="Playground">
          <p className="pg-note">
            Mude as propriedades e o código é gerado na hora, só com o que difere do padrão.
          </p>
          <PlaygroundSection doc={doc} />
        </Section>
      ) : null}

      <Section id="variacoes" title="Variações e estados">
        {doc.demos.map((demo) => (
          <article key={demo.title} className="pg-demo">
            <h3 className="pg-h3">{demo.title}</h3>
            {demo.note ? <p className="pg-note">{demo.note}</p> : null}
            <div className="pg-preview">{demo.preview}</div>
            <CodeBlock
              code={buildSnippet({ code: demo.code, setup: demo.setup })}
              label={`${doc.name}, ${demo.title}`}
            />
          </article>
        ))}
      </Section>

      {doc.anatomy?.length ? (
        <Section id="anatomia" title="Anatomia">
          <p className="pg-note">
            Passe o mouse ou foque um item da lista para ver a parte destacada.
          </p>
          <AnatomySection doc={doc} />
        </Section>
      ) : null}

      <Section id="acessibilidade" title="Teclado e ARIA">
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
      </Section>

      {doc.dos?.length || doc.donts?.length ? (
        <Section id="praticas" title="Faça e não faça">
          <div className="pg-tips-grid">
            <TipList tips={doc.dos ?? []} kind="do" />
            <TipList tips={doc.donts ?? []} kind="dont" />
          </div>
        </Section>
      ) : null}

      <Section id="api" title="API">
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
      </Section>
    </>
  );
}
