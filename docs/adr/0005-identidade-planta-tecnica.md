# ADR 0005 — Identidade "planta técnica"

- Status: aceito
- Data: 2026-11-25

## Contexto

O redesign do pacote de identidade pediu que a documentação parecesse uma prancheta de engenharia
e que os dois Storybooks (React e Angular) parecessem um produto só. O laranja anterior (`#FF5B14`)
e o trio Space Grotesk, DM Sans e Space Mono não tinham mais o papel de assinatura pedido.

## Decisão

- Tokens da identidade com prefixo `--nui-` na página de entrada: grafite `#111111`, papel
  `#FAFAF7`, areia `#E9E6DE`, laranja de marca `#F0501C`, texto sobre o laranja `#160700` e laranja
  de texto `#C73D10` (`#FF8A5C` no escuro). Grade pontilhada de 20 px só no fundo da documentação.
- O preset `nasck` do pacote de tokens exporta a mesma identidade para o antd e o NG-ZORRO:
  primária `#F0501C`, texto sobre ela `#160700`, raio de 3 px, bordas de campo em grafite e fonte
  Geist (Geist Mono no código). Os outros três presets continuam iguais.
- `PalettePreset` ganhou `onPrimary` e `ModeSurface` ganhou `link` e `border`, todos opcionais e
  ainda passando pelo ajuste de contraste: se o valor do preset não chegar a AA, o tema volta ao
  cálculo de antes. Nenhum texto branco vai sobre o laranja.
- Fontes auto-hospedadas por `@fontsource-variable/geist` e `@fontsource-variable/geist-mono`.
- A página de entrada mostra os wrappers React de verdade nos espécimes (não imagens), e todos os
  números dela saem do contrato, dos presets e dos Storybooks buildados.

## Consequências

- O link do preset `nasck` sai `#C13B10`, e não `#C73D10`: é o mínimo de ajuste para passar 4,6:1
  sobre o tom claro do item de menu selecionado.
- A página de entrada passou a ser buildada pelo Vite (`portable-src/`), com um bundle de React e
  antd só para os espécimes.
