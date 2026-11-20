# Changelog

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
