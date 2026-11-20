import type { Meta, StoryObj } from '@storybook/react-vite';
import { checkTheme, type ResolvedTokens } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';
import { useThemeTokens } from '../ui/AppThemeProvider.tsx';

const KEYS = [
  'colorPrimary',
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
  'colorBorderSecondary',
] as const;

function Tokens(): ReactElement {
  const flat = useThemeTokens();
  const checks = checkTheme(flat as ResolvedTokens);
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 1000 }}>
      <h1 style={{ margin: 0 }}>Tokens do tema</h1>
      <p style={{ margin: 0 }}>
        Troque o preset e o modo na barra de ferramentas. Os valores abaixo são os tokens resolvidos
        pelo antd para o tema atual.
      </p>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
      >
        {KEYS.map((key) => (
          <div key={key} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: Number(flat['borderRadius']),
                background: String(flat[key]),
                border: `1px solid ${String(flat['colorBorderSecondary'])}`,
              }}
            />
            <span>
              <code>{key}</code>
              <br />
              <code>{String(flat[key])}</code>
            </span>
          </div>
        ))}
      </div>
      <h2 style={{ margin: '8px 0 0' }}>
        Contraste: {checks.filter((row) => row.pass).length} de {checks.length} pares passam no
        mínimo de AA
      </h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <caption style={{ textAlign: 'left', paddingBottom: 8 }}>
            Razão de contraste de cada par do tema atual (texto 4,5:1 e componentes 3:1).
          </caption>
          <thead>
            <tr>
              {['Par', 'Texto', 'Fundo', 'Razão', 'Mínimo'].map((head) => (
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
                <th scope="row" style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500 }}>
                  {row.label}
                </th>
                <td style={{ padding: '6px 8px' }}>{row.foreground}</td>
                <td style={{ padding: '6px 8px' }}>{row.background}</td>
                <td style={{ padding: '6px 8px' }}>{row.ratio.toFixed(2).replace('.', ',')}:1</td>
                <td style={{ padding: '6px 8px' }}>{row.minimum.toString().replace('.', ',')}:1</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta = {
  title: 'Tema/Tokens',
  component: Tokens,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Tokens>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Atual: Story = {};
