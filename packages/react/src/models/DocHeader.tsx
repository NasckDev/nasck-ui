import type { ReactElement, ReactNode } from 'react';
import { useThemeTokens } from '../ui/AppThemeProvider.tsx';

export interface DocHeaderProps {
  /** Rotulo em monoespacada acima do titulo, como "TEMA / TOKENS". */
  label: string;
  title: string;
  /** Trecho final do titulo com o marca-texto da cor primaria. */
  highlight?: string;
  children?: ReactNode;
}

/** Cabecalho das paginas de documentacao: rotulo mono, titulo forte e texto de apoio. */
export function DocHeader({ label, title, highlight, children }: DocHeaderProps): ReactElement {
  const token = useThemeTokens();
  return (
    <div style={{ display: 'grid', gap: 14, maxWidth: 880 }}>
      <span
        style={{
          fontFamily: String(token['fontFamilyCode']),
          fontSize: 13,
          fontWeight: 500,
          textTransform: 'uppercase',
          color: String(token['colorTextDescription']),
        }}
      >
        {label}
      </span>
      <h1
        style={{
          margin: 0,
          fontSize: 'clamp(36px, 5vw, 56px)',
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: '-0.045em',
        }}
      >
        {title}
        {highlight ? (
          <>
            {' '}
            <mark
              style={{
                background: String(token['colorPrimary']),
                color: String(token['colorTextLightSolid']),
                padding: '0 0.12em',
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
              }}
            >
              {highlight}
            </mark>
          </>
        ) : null}
      </h1>
      {children ? (
        <div style={{ margin: 0, fontSize: 17, lineHeight: 1.55, maxWidth: 640 }}>{children}</div>
      ) : null}
    </div>
  );
}
