# Nasck UI · design system React acessível

[![CI](https://github.com/NasckDev/nasck-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/NasckDev/nasck-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-0a0a0a)

Biblioteca de **20 componentes React acessíveis**, tokens exportáveis, tema claro e escuro com contraste
calculado e um **site de documentação** com playground de props, anatomia, tabelas de teclado e ARIA,
construtor de tema e três telas completas montadas só com a biblioteca.

**Site e demo ao vivo:** <https://nasckdev.github.io/nasck-ui/> · também embutido no portfólio do autor,
em `/projetos/nasck-ui/`.

![Visão geral do site](./docs/prints/desktop-visao-geral.png)

| Página de componente com playground                              | Construtor de tema (escuro)                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| ![Página do Button](./docs/prints/desktop-componente-button.png) | ![Tokens no tema escuro](./docs/prints/desktop-tokens-escuro.png)       |
| **Modelo: painel**                                               | **Modelo: configurações**                                               |
| ![Modelo painel](./docs/prints/desktop-modelo-painel.png)        | ![Modelo configurações](./docs/prints/desktop-modelo-configuracoes.png) |

| Celular: visão geral                                            | Celular: menu                                     | Celular: modelo painel (exemplo composto)                              |
| --------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Visão geral no celular](./docs/prints/mobile-visao-geral.png) | ![Menu no celular](./docs/prints/mobile-menu.png) | ![Modelo painel no celular](./docs/prints/mobile-exemplo-composto.png) |

## O que resolve

Padrões de interface recorrentes (botões, campos, modais, abas, tabelas, menus) eram reimplementados
em cada projeto, com estados, foco e acessibilidade inconsistentes. O Nasck UI centraliza esses padrões
em um único pacote, com contratos claros, testes de teclado e axe em cada componente e documentação que
mostra o código, o teclado e o ARIA de cada um.

## Identidade

- **Tipografia:** Space Grotesk nos títulos, DM Sans no texto e Space Mono no código (auto-hospedadas
  via `@fontsource`, sem requisição externa).
- **Paleta:** monocromática de alto contraste (tinta `#0a0a0a`, papel `#ffffff`, cinzas neutros) com a
  assinatura laranja `#FF5B14` usada com parcimônia em destaques, filetes e foco.
- **Forma:** grade visível como elemento de design, cantos de 2 a 6 px e bordas de 1 px.
- Logotipo SVG próprio, tema claro e escuro, `prefers-color-scheme` respeitado.

## O site de documentação

- **Home** com vitrine viva: botões, formulário, Combobox, Table, Tabs, Avatar, Toast, Menu, Accordion
  e Pagination funcionando de verdade.
- **Cada componente** tem playground com painel de props que gera o código (e botão de copiar),
  variações e estados, anatomia interativa, tabela de teclado e ARIA, "Faça e não faça" e tabela de API.
- **Tokens e construtor de tema:** escolha a cor de destaque, receba a escala de 11 tons (OKLCH), veja
  a prévia nos dois temas, confira o contraste ao vivo e exporte o CSS.
- **Modelos:** painel, configurações e login, montados só com a biblioteca (com validação, estados de
  carregamento, confirmação de exclusão e toasts).
- **Busca Ctrl+K**, navegação lateral com ícones (`lucide-react`) e drawer no celular.
- Animações e transições discretas, todas desligadas em `prefers-reduced-motion`.

## Componentes

| Grupo                    | Componentes                                               |
| ------------------------ | --------------------------------------------------------- |
| Ações                    | Button, IconButton                                        |
| Formulários              | TextField, Checkbox, Switch, Select, Combobox             |
| Navegação e sobreposição | Tabs, Dialog, Toast, Tooltip, Accordion, Menu             |
| Dados                    | Table (ordenável e responsiva), Pagination                |
| Conteúdo e feedback      | Badge, Card, Skeleton, EmptyState, Avatar (e AvatarGroup) |

Todos têm teste de teclado e de axe. Padrões seguidos: APG para Switch, Tabs, Dialog, Tooltip,
Accordion, Menu Button e Combobox; HTML nativo (`button`, `input`, `select`, `table`) onde existe.

## Instalação

```bash
npm install github:NasckDev/nasck-ui
```

```tsx
import '@nasckdev/nasck-ui/styles.css';
import { Button, TextField, ToastProvider } from '@nasckdev/nasck-ui';

export function App() {
  return (
    <ToastProvider>
      <TextField label="E-mail" description="Nunca compartilhamos." />
      <Button>Salvar</Button>
    </ToastProvider>
  );
}
```

As fontes não vêm no pacote: instale `@fontsource-variable/space-grotesk`,
`@fontsource-variable/dm-sans` e `@fontsource/space-mono` (ou use as suas; os nomes estão em
`tokens.font.family`).

## Arquitetura

```mermaid
flowchart LR
  T[src/tokens/tokens.ts] -->|build:tokens| C[src/styles/tokens.css]
  C --> L[Componentes src/components]
  L --> D[dist: ESM + .d.ts + CSS]
  L --> S[playground: site de documentação]
  T --> S
  S -->|build:portable| P[playground-dist: site estático, base ./ e rotas por hash]
  S --> E[e2e: Playwright + axe]
```

Decisões em [`docs/adr/`](./docs/adr): tokens como fonte única, HTML nativo antes de ARIA e identidade
monocromática com tema derivado do destaque.

## Desenvolvimento

```bash
npm install
npm run playground       # site em modo de desenvolvimento
npm run test:coverage    # Vitest + Testing Library + axe-core
npm run lint && npm run typecheck
npm run build            # ESM + .d.ts + CSS (+ dist/tokens.css)
npm run build:portable   # site estático em playground-dist/
npm run test:e2e         # Playwright + axe (usa a build de playground-dist)
```

No Windows, para usar o Chrome instalado nos testes E2E: `PW_CHANNEL=chrome npm run test:e2e`. Em CI o
Chromium do Playwright é instalado pelo workflow.

## Build portátil

`npm run build:portable` (alias de `build:playground`) gera `playground-dist/` com `base: './'`, nomes de
arquivo com hash e rotas por hash (`#/componentes/button`). A pasta funciona servida em qualquer subpath
(`/projetos/nasck-ui/`, `/Myportfolio/projetos/nasck-ui/`, GitHub Pages) e recarrega em qualquer rota.

## Acessibilidade

- Teclado em tudo, foco visível de duas camadas (3:1 ou mais) e `forced-colors` tratado.
- Contraste AA nos dois temas, calculado: a página de Tokens mostra a razão de cada par e os testes
  falham se algum ficar abaixo do mínimo. O construtor de tema deriva os papéis de destaque para cumprir
  o contraste com qualquer cor escolhida.
- Cor nunca é o único sinal (badges levam texto; ordenação leva texto para leitor de tela).
- Alvos de toque de 44 px, funciona de 320 a 1440 px sem rolagem horizontal e com zoom.
- axe sem violações nos testes de componente (jsdom) e nas páginas principais do site, nos dois temas
  (E2E, navegador real, com `color-contrast`).

## Qualidade e resultados

**RESULTADOS**

## Licença

MIT © Alexandre Diogo Nascimento
