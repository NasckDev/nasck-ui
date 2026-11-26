# Changelog

## Não lançado

Identidade "planta técnica" ([ADR 0005](./docs/adr/0005-identidade-planta-tecnica.md)), sem mudança
na API dos componentes.

- Preset `nasck` com laranja `#F0501C`, texto `#160700` sobre ele, raio de 3 px, bordas em grafite e
  fontes Geist e Geist Mono. Os outros presets não mudam.
- Presets podem definir `onPrimary`, `link` e `border`, sempre com o ajuste de contraste AA.
- Storybooks React e Angular com o mesmo tema (claro ou escuro conforme o sistema).
- Página de entrada nova, buildada pelo Vite, com espécimes reais dos wrappers React e números lidos
  do repositório.
- Correções de layout em tela estreita: a tabela acessível do `AppChart` alargava a página (React e
  Angular), o `AppPagination` não quebrava linha, o título do `AppCard` era cortado com reticências e a
  tabela de props das páginas de docs vazava. Novo E2E de larguras (320 a 1920 px).
- Angular: etiquetas do `AppSelect` múltiplo e o campo desabilitado ficavam com texto claro sobre o
  fundo fixo do NG-ZORRO no tema escuro.

## 1.0.0

Reestruturação completa: o Nasck UI deixa de ser um design system React escrito do zero e passa a ser
a biblioteca de wrappers de referência sobre Ant Design (React) e NG-ZORRO (Angular). Veja o
[ADR 0004](./docs/adr/0004-wrappers-sobre-antd-e-ng-zorro.md).

- Monorepo com `packages/tokens`, `packages/react` e `packages/angular`.
- 28 componentes `App*` com os mesmos nomes e a mesma API nos dois frameworks, garantidos por um teste de contrato.
- Storybook React e Storybook Angular com os estados padrão, desabilitado, carregando, erro e vazio, addon de acessibilidade, tema Nasck e seletor de preset na barra de ferramentas.
- Construtor de tema com verificação de contraste AA e exportação.
- Demo estática única (`npm run build:portable`) com caminhos relativos.
- Removidos: os componentes próprios antigos e o site de documentação antigo (tag `v0.2.0-legacy`).

## 0.2.0 e anteriores

Versões do design system React escrito do zero. Estão na tag `v0.2.0-legacy`.
