import { useState } from 'react';
import { Badge, Button, Select, tokens, type ColorRole, type ThemeName } from '../../../src';
import { contrastLevel, contrastRatio, type ContrastLevel } from '../contrast';
import { COLOR_GROUPS, CONTRAST_PAIRS } from './tokensData';

const LEVEL_LABEL: Record<ContrastLevel, string> = {
  AAA: 'AAA',
  AA: 'AA',
  'AA-large': 'AA (UI / texto grande)',
  fail: 'Reprovado',
};

const LEVEL_TONE: Record<ContrastLevel, 'success' | 'info' | 'danger'> = {
  AAA: 'success',
  AA: 'success',
  'AA-large': 'info',
  fail: 'danger',
};

const themeLabel = (theme: ThemeName): string => (theme === 'light' ? 'claro' : 'escuro');

const familyName = (stack: string): string => (stack.split(',')[0] ?? '').replaceAll("'", '');

function Swatch({ theme, role }: { theme: ThemeName; role: ColorRole }) {
  const value = tokens.color[theme][role];
  return (
    <li className="pg-swatch">
      <span className="pg-swatch__chip" style={{ background: value }} aria-hidden="true" />
      <span className="pg-swatch__text">
        <code>{role}</code>
        <span>{value}</span>
      </span>
    </li>
  );
}

function ColorSection({ theme }: { theme: ThemeName }) {
  return (
    <div className="pg-grid pg-grid--2">
      {COLOR_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="pg-h3">{group.title}</h3>
          <ul className="pg-swatches">
            {group.roles.map((role) => (
              <Swatch key={role} theme={theme} role={role} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ContrastTable({ theme }: { theme: ThemeName }) {
  const colors = tokens.color[theme];
  return (
    <div
      className="pg-table-wrap"
      role="region"
      aria-label={`Contraste no tema ${themeLabel(theme)}`}
      tabIndex={0}
    >
      <table className="pg-table">
        <thead>
          <tr>
            <th scope="col">Par</th>
            <th scope="col">Amostra</th>
            <th scope="col">Razão</th>
            <th scope="col">Mínimo</th>
            <th scope="col">Nível</th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => {
            const fg = colors[pair.foreground];
            const bg = colors[pair.background];
            const ratio = contrastRatio(fg, bg);
            const level = contrastLevel(ratio);
            return (
              <tr key={pair.label}>
                <th scope="row">{pair.label}</th>
                <td>
                  <span className="pg-sample" style={{ color: fg, background: bg }}>
                    Aa
                  </span>
                </td>
                <td className="pg-num">{ratio.toFixed(2)}:1</td>
                <td className="pg-num">{pair.required}:1</td>
                <td>
                  <Badge tone={LEVEL_TONE[level]}>{LEVEL_LABEL[level]}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MotionDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="pg-motion">
      <Button variant="secondary" size="sm" onClick={() => setRun((count) => count + 1)}>
        Reproduzir
      </Button>
      <ul className="pg-motion__list">
        {Object.entries(tokens.motion.duration).map(([name, value]) => (
          <li key={name} className="pg-motion__row">
            <code>{name}</code>
            <span className="pg-type__meta">{value}</span>
            <span className="pg-motion__track" aria-hidden="true">
              <span
                key={run}
                className="pg-motion__dot"
                data-run={run > 0 ? 'on' : 'off'}
                style={{ animationDuration: `var(--nui-motion-duration-${name})` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <p className="pg-note">
        Com <code>prefers-reduced-motion: reduce</code> todas as durações viram <code>0ms</code>.
      </p>
    </div>
  );
}

export function TokensPage() {
  const [theme, setTheme] = useState<ThemeName>('light');
  return (
    <>
      <header className="pg-page-head">
        <p className="pg-eyebrow">Fundamentos</p>
        <h1 className="pg-h1" tabIndex={-1} id="page-title">
          Tokens
        </h1>
        <p className="pg-lead">
          Fonte única em <code>src/tokens/tokens.ts</code>, exportada para CSS (<code>--nui-*</code>
          ) por <code>npm run build:tokens</code>. Os valores abaixo são lidos do próprio objeto{' '}
          <code>tokens</code>; as razões de contraste são calculadas aqui, não digitadas.
        </p>
      </header>

      <section aria-labelledby="sec-cores" className="pg-section">
        <h2 id="sec-cores" className="pg-h2">
          Cores
        </h2>
        <div className="pg-toolbar">
          <Select
            label="Paleta exibida"
            value={theme}
            onChange={(event) => setTheme(event.target.value as ThemeName)}
            options={[
              { value: 'light', label: 'Tema claro' },
              { value: 'dark', label: 'Tema escuro' },
            ]}
          />
        </div>
        <div className="pg-theme-box" data-theme={theme}>
          <ColorSection theme={theme} />
        </div>
        <h3 className="pg-h3">Contraste calculado ({themeLabel(theme)})</h3>
        <p className="pg-note">
          Razão pela fórmula WCAG 2.x. Texto exige 4,5:1; bordas de controle e anel de foco exigem
          3:1 (WCAG 1.4.11). Os testes do repositório falham se algum par ficar abaixo do mínimo,
          nos dois temas.
        </p>
        <ContrastTable theme={theme} />
      </section>

      <section aria-labelledby="sec-tipo" className="pg-section">
        <h2 id="sec-tipo" className="pg-h2">
          Tipografia
        </h2>
        <ul className="pg-type">
          {Object.entries(tokens.font.size).map(([name, size]) => (
            <li key={name} className="pg-type__row">
              <code>{name}</code>
              <span className="pg-type__meta">{size}</span>
              <span style={{ fontSize: size }} className="pg-type__sample">
                Interfaces acessíveis por padrão
              </span>
            </li>
          ))}
        </ul>
        <div className="pg-grid pg-grid--2">
          <div>
            <h3 className="pg-h3">Famílias</h3>
            <p className="pg-sample-text" style={{ fontFamily: tokens.font.family.sans }}>
              Sans · {familyName(tokens.font.family.sans)}
            </p>
            <p className="pg-sample-text" style={{ fontFamily: tokens.font.family.mono }}>
              Mono · {familyName(tokens.font.family.mono)}
            </p>
            <p className="pg-note">
              As fontes são empilhadas com fallback do sistema; nada é baixado de terceiros.
            </p>
          </div>
          <div>
            <h3 className="pg-h3">Pesos e entrelinha</h3>
            <ul className="pg-plain">
              {Object.entries(tokens.font.weight).map(([name, weight]) => (
                <li key={name} style={{ fontWeight: Number(weight) }}>
                  {name} · {weight}
                </li>
              ))}
              {Object.entries(tokens.font.lineHeight).map(([name, value]) => (
                <li key={name}>
                  entrelinha {name} · {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="sec-espaco" className="pg-section">
        <h2 id="sec-espaco" className="pg-h2">
          Espaço
        </h2>
        <ul className="pg-space">
          {Object.entries(tokens.space).map(([name, value]) => (
            <li key={name} className="pg-space__row">
              <code>space-{name}</code>
              <span className="pg-type__meta">{value}</span>
              <span className="pg-space__bar" style={{ width: value }} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-forma" className="pg-section">
        <h2 id="sec-forma" className="pg-h2">
          Raios e sombras
        </h2>
        <h3 className="pg-h3">Raios</h3>
        <ul className="pg-shapes">
          {Object.entries(tokens.radius).map(([name, value]) => (
            <li key={name}>
              <span className="pg-shape" style={{ borderRadius: value }} aria-hidden="true" />
              <code>{name}</code>
              <span className="pg-type__meta">{value}</span>
            </li>
          ))}
        </ul>
        <h3 className="pg-h3">Sombras</h3>
        <ul className="pg-shapes">
          {Object.entries(tokens.shadow).map(([name, value]) => (
            <li key={name}>
              <span
                className="pg-shape pg-shape--card"
                style={{ boxShadow: value }}
                aria-hidden="true"
              />
              <code>{name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-mov" className="pg-section">
        <h2 id="sec-mov" className="pg-h2">
          Movimento
        </h2>
        <MotionDemo />
        <h3 className="pg-h3">Curvas</h3>
        <ul className="pg-plain">
          {Object.entries(tokens.motion.easing).map(([name, value]) => (
            <li key={name}>
              <code>{name}</code> <span className="pg-type__meta">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
