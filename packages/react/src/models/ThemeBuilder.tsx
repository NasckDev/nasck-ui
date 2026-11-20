import {
  buildTheme,
  checkTheme,
  presets,
  toCssText,
  type ResolvedTokens,
  type ThemeMode,
} from '@nasckdev/nasck-ui-tokens';
import { useMemo, useState, type ReactElement } from 'react';
import { AppAlert } from '../ui/AppAlert.tsx';
import { AppButton } from '../ui/AppButton.tsx';
import { AppCard } from '../ui/AppCard.tsx';
import { AppSelect } from '../ui/AppSelect.tsx';
import { AppStatistic } from '../ui/AppStatistic.tsx';
import { AppStatus, AppTag } from '../ui/AppTag.tsx';
import { AppSwitch } from '../ui/AppSwitch.tsx';
import { AppTabs } from '../ui/AppTabs.tsx';
import { AppThemeScope, resolveTokens, useThemeTokens } from '../ui/AppThemeProvider.tsx';

const HEX = /^#[0-9a-fA-F]{6}$/;
const SWATCH_KEYS = [
  'colorPrimary',
  'colorPrimaryHover',
  'colorPrimaryActive',
  'colorPrimaryBg',
  'colorLink',
  'colorSuccess',
  'colorWarning',
  'colorError',
  'colorInfo',
  'colorBgLayout',
  'colorBgContainer',
  'colorText',
  'colorTextSecondary',
  'colorBorder',
] as const;

export function ThemeBuilder(): ReactElement {
  const [presetId, setPresetId] = useState('nasck');
  const [primary, setPrimary] = useState('#FF5B14');
  const [draft, setDraft] = useState('#FF5B14');
  const [dark, setDark] = useState(false);
  const mode: ThemeMode = dark ? 'dark' : 'light';

  const built = useMemo(() => buildTheme(presetId, { mode, primary }), [presetId, mode, primary]);
  const resolved = useMemo(() => resolveTokens(built), [built]);
  const checks = useMemo(() => checkTheme(resolved as ResolvedTokens), [resolved]);
  const failing = checks.filter((row) => !row.pass).length;

  const exportTs = `import type { ThemeConfig } from 'antd';\n\nexport const tema: ThemeConfig = ${JSON.stringify(
    { token: built.token, components: built.components },
    null,
    2,
  )};\n`;
  const exportJson = JSON.stringify(resolved, null, 2);
  const exportCss = toCssText(resolved);
  const exports = [
    { key: 'ts', label: 'TypeScript (antd)', content: exportTs },
    { key: 'css', label: 'CSS (NG-ZORRO)', content: exportCss },
    { key: 'json', label: 'JSON', content: exportJson },
  ];
  const [exportKey, setExportKey] = useState('ts');
  const current = exports.find((item) => item.key === exportKey) ?? exports[0];

  const applyDraft = (value: string): void => {
    setDraft(value);
    if (HEX.test(value)) setPrimary(value.toUpperCase());
  };

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 1200 }}>
      <h1 style={{ margin: 0 }}>Construtor de tema</h1>
      <p style={{ margin: 0 }}>
        Escolha a cor primária. O tema do Ant Design é gerado na hora, o contraste AA é verificado
        nos pares de cor e você exporta o resultado para React ou Angular.
      </p>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <AppCard title="1. Escolha a cor">
          <div style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span style={{ fontWeight: 500 }}>Cor primária</span>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="color"
                  aria-label="Seletor de cor primária"
                  value={HEX.test(draft) ? draft : primary}
                  onChange={(event) => applyDraft(event.target.value)}
                  style={{ width: 56, height: 40, padding: 0, border: 0, background: 'none' }}
                />
                <input
                  aria-label="Código hexadecimal da cor primária"
                  value={draft}
                  onChange={(event) => applyDraft(event.target.value)}
                  spellCheck={false}
                  style={{
                    font: 'inherit',
                    padding: '6px 10px',
                    width: 120,
                    border: '1px solid currentColor',
                    borderRadius: 4,
                    background: 'transparent',
                    color: 'inherit',
                  }}
                />
              </span>
            </label>
            {!HEX.test(draft) ? (
              <AppAlert type="warning" title="Use o formato #RRGGBB" showIcon />
            ) : null}
            <AppSelect
              label="Começar de um preset"
              value={presetId}
              options={presets.map((preset) => ({ value: preset.id, label: preset.label }))}
              onChange={(value) => {
                const id = String(value);
                const preset = presets.find((item) => item.id === id);
                setPresetId(id);
                if (preset) applyDraft(preset.primary);
              }}
            />
            <AppSwitch label="Pré-visualizar no tema escuro" checked={dark} onChange={setDark} />
          </div>
        </AppCard>

        <AppThemeScope theme={built}>
          <PreviewPanel resolved={resolved} />
        </AppThemeScope>
      </div>

      <AppCard
        title="2. Contraste (WCAG 2.2 AA)"
        extra={failing === 0 ? 'Todos os pares passam' : `${failing} par(es) abaixo do mínimo`}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <caption style={{ textAlign: 'left', paddingBottom: 8 }}>
              Razão de contraste de cada par, calculada sobre os tokens resolvidos pelo algoritmo do
              antd.
            </caption>
            <thead>
              <tr>
                {['Par', 'Texto', 'Fundo', 'Razão', 'Mínimo', 'Resultado'].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      borderBottom: '1px solid currentColor',
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checks.map((row) => (
                <tr key={row.id}>
                  <th
                    scope="row"
                    style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500 }}
                  >
                    {row.label}
                  </th>
                  <td style={{ padding: '6px 8px' }}>
                    <Swatch color={row.foreground} /> {row.foreground}
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <Swatch color={row.background} /> {row.background}
                  </td>
                  <td style={{ padding: '6px 8px' }}>{row.ratio.toFixed(2).replace('.', ',')}:1</td>
                  <td style={{ padding: '6px 8px' }}>
                    {row.minimum.toString().replace('.', ',')}:1
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                    <AppStatus
                      status={row.pass ? 'success' : 'error'}
                      label={row.pass ? 'Passa' : 'Falha'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppCard>

      <AppCard title="3. Tokens gerados">
        <div
          style={{
            display: 'grid',
            gap: 8,
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          }}
        >
          {SWATCH_KEYS.map((key) => {
            const value = resolved[key];
            return typeof value === 'string' ? (
              <div key={key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Swatch color={value} large />
                <span>
                  <code>{key}</code>
                  <br />
                  <code>{value}</code>
                </span>
              </div>
            ) : null;
          })}
        </div>
      </AppCard>

      <AppCard title="4. Exportar">
        <AppTabs
          items={exports.map((item) => ({ key: item.key, label: item.label }))}
          activeKey={exportKey}
          onChange={setExportKey}
        >
          {/* Regiao rolavel precisa ser focavel por teclado (axe: scrollable-region-focusable). */}
          <pre
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            aria-label={`Código exportado em ${current?.label ?? ''}`}
            style={{
              maxHeight: 280,
              overflow: 'auto',
              margin: '12px 0',
              padding: 12,
              fontFamily: 'var(--ant-font-family-code, monospace)',
              fontSize: 13,
              border: '1px solid currentColor',
              borderRadius: 4,
            }}
          >
            {current?.content}
          </pre>
          <AppButton
            variant="primary"
            icon="download"
            onClick={() => void navigator.clipboard?.writeText(current?.content ?? '')}
          >
            Copiar código
          </AppButton>
        </AppTabs>
      </AppCard>
    </div>
  );
}

function Swatch({ color, large = false }: { color: string; large?: boolean }): ReactElement {
  const size = large ? 32 : 14;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        background: color,
        border: '1px solid rgba(128,128,128,.6)',
        borderRadius: 3,
        verticalAlign: 'middle',
        flex: 'none',
      }}
    />
  );
}

function PreviewPanel({
  resolved,
}: {
  resolved: Record<string, string | number | boolean>;
}): ReactElement {
  const token = useThemeTokens();
  return (
    <div
      style={{
        background: String(resolved['colorBgLayout']),
        color: String(resolved['colorText']),
        padding: Number(token['paddingLG']),
        borderRadius: Number(token['borderRadiusLG']),
        border: `1px solid ${String(resolved['colorBorderSecondary'])}`,
        display: 'grid',
        gap: 12,
        alignContent: 'start',
      }}
    >
      <strong>Pré-visualização</strong>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <AppButton variant="primary">Primário</AppButton>
        <AppButton>Padrão</AppButton>
        <AppButton variant="link">Link</AppButton>
        <AppButton variant="primary" danger>
          Perigo
        </AppButton>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <AppTag label="Sucesso" color="success" />
        <AppTag label="Aviso" color="warning" />
        <AppTag label="Erro" color="error" />
        <AppTag label="Info" color="info" />
      </div>
      <AppCard size="small">
        <AppStatistic title="Receita do mês" value={66400} prefix="R$ " precision={2} trend="up" />
      </AppCard>
    </div>
  );
}
