# ADR 0004 — Nasck UI vira a biblioteca de wrappers sobre Ant Design e NG-ZORRO

- Status: aceito
- Data: 2026-11-20

## Contexto

O Nasck UI era um design system React escrito do zero (20 componentes, tokens próprios e site de
documentação próprio). O dono definiu um padrão de UI para todos os projetos (`PADRAO-UI-ANTD.md`):
Ant Design no React, NG-ZORRO no Angular, ECharts nos gráficos, wrappers próprios com o mesmo nome e
as mesmas props nos dois frameworks, tema central e Storybook. Os apps (InsightHub, FiscoTrack e
OpsFlow) precisam de uma referência única do contrato desses wrappers.

## Decisão

1. **Monorepo com npm workspaces** em `packages/`:
   - `tokens`: presets de paleta, geração do tema do antd, verificação de contraste AA, variáveis
     CSS para o NG-ZORRO, tipos do contrato e a montagem da option do ECharts.
   - `react`: wrappers `App*` sobre o antd.
   - `angular`: wrappers standalone `app-*` sobre o NG-ZORRO.
2. **O contrato é um arquivo** (`contract/contract.json`) e **um teste** lê o código dos dois pacotes
   (AST do TypeScript) e falha se props, inputs, eventos, outputs ou seletores divergirem.
3. **Apps não instalam o pacote.** Cada app mantém o próprio `src/ui/` seguindo o contrato, porque
   instalar via GitHub é lento. O Nasck UI é a referência, não uma dependência.
4. **Código antigo removido, não movido para `legacy/`.** Os componentes próprios e o site de
   documentação saem do produto. O histórico completo fica no git e a tag `v0.2.0-legacy` aponta para
   o último commit que os tinha. Manter uma pasta `legacy/` aumentaria o tempo de instalação, de lint e
   de CI para um código que ninguém mais usa.
5. **Demo estática única** (`portable-dist/`): entrada própria mais os dois Storybooks buildados em
   `react/` e `angular/`, com caminhos relativos para servir em qualquer subpath do portfólio.

## Consequências

- O NG-ZORRO 22 ainda é o CSS no estilo do Ant Design v4: só a paleta primária e as semânticas leem
  variáveis CSS (`--ant-primary-*`, `--ant-error-color`...). O restante (texto, fundos, bordas, raio)
  é fixo. Por isso o pacote Angular traz `nasck-overrides.css`, que repinta as superfícies com os
  tokens resolvidos. Visual idêntico ao antd 6 não é garantido, e a diferença está documentada no
  README.
- Para o texto sobre a cor primária passar AA, o tema calcula preto ou branco pelo contraste e ajusta
  a primária só quando nenhum dos dois alcança 4,5:1 (caso do azul `#2F6BFF`).
- Os tokens resolvidos do antd são gerados em `resolved.generated.ts` por um script e conferidos no
  CI (`git diff --exit-code`), assim o Angular não depende do antd em tempo de execução.
