# @nasckdev/nasck-ui

## 0.2.0

### Minor Changes

- Nova identidade visual: paleta monocromática com laranja de assinatura, Space Grotesk, DM Sans e Space Mono, cantos de 2 a 6 px. Novos papéis de cor `primary*` e `accentText`; `accent` passa a ser a cor de marca (fundos, filetes, foco).
- Novos componentes: Avatar (e AvatarGroup), Table (ordenável e responsiva), Pagination, Accordion, Menu e Combobox, todos com testes de teclado e axe.
- Tabs rolam na horizontal em telas estreitas; campos ocupam 100% da largura do contêiner.
- Instalação pelo GitHub funciona (`prepare` compila o `dist`); peer de React passa a ser `^19`; pacotes só do site saem das dependências.
- Correções de robustez: Dialog não rouba mais o foco em re-renders e trava a rolagem do fundo; pilha de camadas para Esc (Dialog, Menu, Combobox, Tooltip, Toast); Menu em camada própria e sem refoco; Combobox sincroniza texto, envia `name` e limpa; Tabs e Accordion com ids seguros; Toast pausa em hover e foco; Pagination sem perder foco; `forced-colors` em Switch, Tabs e Combobox; alvos de toque de 44 px.
- Tabela em cartões com botões de ordenação visíveis e coluna `sortable` exigindo `sortValue` nos tipos.
- Site de documentação refeito: playground de props com geração de código, anatomia, teclado e ARIA, construtor de tema, modelos de telas, busca Ctrl+K e testes E2E com Playwright e axe.

## 0.1.0

### Minor Changes

- Primeira versão: design tokens (cor clara/escura, tipografia, espaço, raio, sombra, movimento,
  z-index) exportados como TypeScript e CSS custom properties, e 14 componentes acessíveis
  (Button, IconButton, TextField, Checkbox, Switch, Select, Tabs, Dialog, Toast, Tooltip, Badge,
  Card, Skeleton, EmptyState).
