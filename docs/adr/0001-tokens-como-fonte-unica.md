# ADR 0001 — Tokens tipados como fonte única

- Status: substituído pelo ADR 0004 (histórico do código legado, tag v0.2.0-legacy)
- Data: 2026-11-19

## Contexto

Cada projeto redefinia cores, espaçamentos e durações, o que gerava divergência visual e temas
escuros incompletos.

## Decisão

Os tokens vivem em `src/tokens/tokens.ts` (objeto `as const`), com cores **semânticas** por tema
(`light`, `dark`). Uma função pura (`tokensToCss`) gera `src/styles/tokens.css` com custom
properties `--nui-*`, incluindo `prefers-color-scheme` e `prefers-reduced-motion`. O mesmo objeto é
exportado em `@nasckdev/nasck-ui/tokens` para uso em JS (gráficos, canvas, testes).

## Consequências

- Um teste e um passo da CI garantem que o CSS gerado está sincronizado com a fonte.
- Componentes só consomem `var(--nui-*)`; trocar tema não exige re-render React.
- Ferramentas externas (Figma, Style Dictionary) podem consumir o objeto exportado.
