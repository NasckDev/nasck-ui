import { Check, Download, RotateCcw, X } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import { Avatar, Badge, Button, Combobox, Switch, Tabs, TextField } from '../../../src';
import { CodeBlock } from '../components/CodeBlock';
import { contrastRatio } from '../contrast';
import {
  ACCENT_ROLES,
  SCALE_STEPS,
  checkAccentTheme,
  deriveAccentTheme,
  exportThemeCss,
  generateScale,
  isHex,
  type AccentTheme,
  type ContrastCheck,
} from '../lib/themeScale';

const DEFAULT_ACCENT = '#ff5b14';

const PRESETS = [
  { name: 'Laranja Nasck', hex: DEFAULT_ACCENT },
  { name: 'Azul', hex: '#2563eb' },
  { name: 'Verde', hex: '#16a34a' },
  { name: 'Ameixa', hex: '#a21caf' },
  { name: 'Rosa', hex: '#e11d48' },
  { name: 'Turquesa', hex: '#0d9488' },
  { name: 'Âmbar', hex: '#f59e0b' },
];

const toStyle = (theme: AccentTheme): CSSProperties =>
  Object.fromEntries(
    ACCENT_ROLES.map((role) => [
      `--nui-color-${role.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
      theme[role],
    ]),
  ) as CSSProperties;

const readableOn = (hex: string): string =>
  contrastRatio('#0a0a0a', hex) >= contrastRatio('#ffffff', hex) ? '#0a0a0a' : '#ffffff';

function Preview({
  theme,
  mode,
  label,
}: {
  theme: AccentTheme;
  mode: 'light' | 'dark';
  label: string;
}) {
  return (
    <div
      className="pg-tb-preview"
      data-theme={mode}
      style={toStyle(theme)}
      role="group"
      aria-label={label}
    >
      <div className="pg-tb-preview__head">
        <Avatar name="Marina Duarte" size="sm" />
        <strong>{label}</strong>
        <Badge tone="accent">Novo</Badge>
      </div>
      <Tabs
        label={`Seções (${label})`}
        items={[
          { id: 'a', label: 'Resumo', content: 'Foco, abas e filetes usam o destaque.' },
          { id: 'b', label: 'Atividade', content: 'Navegue com as setas.' },
        ]}
      />
      <TextField
        label="Nome do projeto"
        defaultValue="Nasck UI"
        description="Foque o campo para ver o anel."
      />
      <Combobox
        label="Cidade"
        options={[
          { value: 'sp', label: 'São Paulo' },
          { value: 'rj', label: 'Rio de Janeiro' },
        ]}
        defaultValue="sp"
      />
      <Switch label="Notificações" defaultChecked />
      <button type="button" className="pg-tb-accent-button nui-focusable">
        Botão de destaque
      </button>
      <div className="pg-tb-surface">Superfície de destaque com texto de destaque.</div>
    </div>
  );
}

function ChecksTable({ checks, title }: { checks: ContrastCheck[]; title: string }) {
  return (
    <div className="pg-table-wrap" role="region" aria-label={title} tabIndex={0}>
      <table className="pg-table">
        <caption className="pg-caption">{title}</caption>
        <thead>
          <tr>
            <th scope="col">Par</th>
            <th scope="col">Amostra</th>
            <th scope="col">Razão</th>
            <th scope="col">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.label}>
              <th scope="row">{check.label}</th>
              <td>
                <span
                  className="pg-sample"
                  style={{ background: check.background }}
                  aria-hidden="true"
                >
                  <span className="pg-sample__dot" style={{ background: check.foreground }} />
                </span>
              </td>
              <td className="pg-num">
                {check.ratio.toFixed(2)}:1{' '}
                <span className="pg-type__meta">(mín. {check.required})</span>
              </td>
              <td>
                <Badge tone={check.passes ? 'success' : 'danger'}>
                  {check.passes ? (
                    <Check size={12} aria-hidden="true" />
                  ) : (
                    <X size={12} aria-hidden="true" />
                  )}
                  &nbsp;{check.passes ? 'Passa' : 'Reprovado'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ThemeBuilder() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [draft, setDraft] = useState(DEFAULT_ACCENT);
  const valid = isHex(draft);

  const model = useMemo(() => {
    const light = deriveAccentTheme(accent, 'light');
    const dark = deriveAccentTheme(accent, 'dark');
    return {
      scale: generateScale(accent),
      light,
      dark,
      lightChecks: checkAccentTheme(light, 'light'),
      darkChecks: checkAccentTheme(dark, 'dark'),
      css: exportThemeCss(light, dark),
    };
  }, [accent]);

  const choose = (hex: string) => {
    setAccent(hex.toLowerCase());
    setDraft(hex.toLowerCase());
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([model.css], { type: 'text/css' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nasck-ui-tema.css';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="sec-construtor" className="pg-section pg-tb">
      <p className="pg-eyebrow">Construtor de tema</p>
      <h2 id="sec-construtor" className="pg-h2" tabIndex={-1}>
        Escolha o destaque, receba o tema
      </h2>
      <p className="pg-note">
        A escala de 11 tons é gerada em OKLCH, os papéis de destaque são derivados para cumprir o
        contraste AA nos dois temas e o CSS fica pronto para colar.
      </p>

      <div className="pg-tb-controls">
        <div className="pg-tb-picker">
          <label className="pg-tb-color">
            <span className="nui-visually-hidden">Escolher cor de destaque</span>
            <input
              type="color"
              value={accent}
              onChange={(event) => choose(event.target.value)}
              className="nui-focusable"
            />
          </label>
          <TextField
            label="Cor de destaque (hex)"
            value={draft}
            maxLength={7}
            spellCheck={false}
            error={valid ? undefined : 'Use o formato #rrggbb.'}
            onChange={(event) => {
              setDraft(event.target.value);
              if (isHex(event.target.value)) setAccent(event.target.value.toLowerCase());
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            startIcon={<RotateCcw size={14} aria-hidden="true" />}
            onClick={() => choose(DEFAULT_ACCENT)}
          >
            Restaurar
          </Button>
        </div>
        <div className="pg-tb-presets" role="group" aria-label="Cores sugeridas">
          {PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              className="pg-tb-preset nui-focusable"
              aria-pressed={accent === preset.hex}
              onClick={() => choose(preset.hex)}
            >
              <span
                className="pg-tb-preset__dot"
                style={{ background: preset.hex }}
                aria-hidden="true"
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <h3 className="pg-h3">Escala gerada</h3>
      <ol className="pg-tb-scale">
        {SCALE_STEPS.map((step) => {
          const hex = model.scale[step];
          return (
            <li
              key={step}
              className="pg-tb-step"
              style={{ background: hex, color: readableOn(hex) }}
              data-base={hex === accent}
            >
              <span>{step}</span>
              <code>{hex}</code>
              {hex === accent ? <span className="pg-tb-step__flag">base</span> : null}
            </li>
          );
        })}
      </ol>

      <h3 className="pg-h3">Prévia ao vivo</h3>
      <div className="pg-tb-previews">
        <Preview theme={model.light} mode="light" label="Tema claro" />
        <Preview theme={model.dark} mode="dark" label="Tema escuro" />
      </div>

      <h3 className="pg-h3">Contraste verificado</h3>
      <div className="pg-stack pg-stack--wide">
        <ChecksTable checks={model.lightChecks} title="Tema claro" />
        <ChecksTable checks={model.darkChecks} title="Tema escuro" />
      </div>

      <h3 className="pg-h3">CSS para exportar</h3>
      <p className="pg-note">
        Importe depois do CSS da biblioteca. Só os papéis de destaque são sobrescritos.
      </p>
      <CodeBlock code={model.css} label="CSS do tema gerado" lang="css" />
      <Button
        variant="secondary"
        startIcon={<Download size={16} aria-hidden="true" />}
        onClick={download}
      >
        Baixar nasck-ui-tema.css
      </Button>
    </section>
  );
}
