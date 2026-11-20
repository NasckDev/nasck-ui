# ADR 0003 — Identidade monocromática e tema derivado do destaque

- Status: aceito
- Data: 2026-11-19

## Contexto

A primeira versão usava um índigo genérico, e o resultado parecia um tutorial. O produto precisa de
identidade própria e, ao mesmo tempo, de contraste AA verificável. O laranja de assinatura `#FF5B14`
tem contraste de apenas 3,1:1 sobre branco: não serve como cor de texto nem como fundo de botão
com texto branco.

## Decisão

- A interface é monocromática (tinta `#0a0a0a`, papel `#ffffff`, cinzas neutros). O papel `primary`
  é a tinta; botões primários, chaves ligadas e a página atual da paginação usam `primary`.
- O laranja entra como `accent` (fundos de marca, filetes, anel de foco, marcas). Texto sobre o
  laranja é sempre `#0a0a0a` (6,4:1). Para texto laranja existe um papel separado, `accentText`
  (`#c2410c` no claro, `#ff7a3d` no escuro), com contraste AA calculado.
- Tipografia: Space Grotesk (títulos e rótulos de ação), DM Sans (texto) e Space Mono (código e
  metadados), auto-hospedadas pelo site via `@fontsource`. A biblioteca só referencia os nomes.
- O construtor de tema (`playground/src/lib/themeScale.ts`) gera a escala em OKLCH e deriva os
  sete papéis de destaque para cada tema escolhendo o primeiro tom que cumpre o contraste
  exigido. Há testes de contraste para oito cores de teste nos dois temas.

## Consequências

- Trocar o destaque não exige mexer em componentes: basta sobrescrever os papéis `accent*`.
- Existe um papel a mais (`accentText`) que quem consome precisa conhecer; a página de Tokens
  documenta cada par com a razão calculada.
- Cores muito claras (como amarelo) geram `accentText` escuro e uma superfície de destaque quase
  neutra; o construtor mostra isso na tabela de contraste em vez de esconder.
