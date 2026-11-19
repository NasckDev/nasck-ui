# Nasck UI · Accessible Product Interface System

[![CI](https://github.com/NasckDev/nasck-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/NasckDev/nasck-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)

Biblioteca de componentes React acessíveis, com design tokens exportáveis, documentação de teclado
por componente e governança de qualidade (lint, tipos, testes com axe e CI).

## Problema

Padrões de interface recorrentes (botões, campos, modais, abas, notificações) eram reimplementados
em cada projeto, com estados, foco e acessibilidade inconsistentes. O Nasck UI centraliza esses
padrões em um único pacote, com contratos claros e testados.

## Decisões

- **Tokens como fonte única** (`src/tokens/tokens.ts`): cor (tema claro e escuro), tipografia,
  espaço, raio, sombra, movimento e z-index. O script `npm run build:tokens` gera
  `src/styles/tokens.css` com custom properties `--nui-*`; a CI falha se o CSS estiver dessincronizado.
- **Temas**: `data-theme="light" | "dark"` no `<html>` ou, sem atributo, segue
  `prefers-color-scheme`.
- **Movimento**: todas as durações vêm de tokens e vão a `0ms` com `prefers-reduced-motion: reduce`.
- **Foco visível**: anel duplo (`bg` + `focus-ring`) que funciona em fundo claro e escuro, e
  `outline` em `forced-colors`.
- **HTML nativo primeiro**: `button`, `input`, `select` e `label` reais; ARIA apenas onde o HTML não
  basta (switch, tabs, dialog, tooltip).
- **Sem dependências de runtime** além de React.

## Componentes

| Componente | Padrão / semântica | Teclado | Testes (teclado + axe) |
| --- | --- | --- | --- |
| Button | `button` nativo, `aria-busy` no loading | Enter, Espaço | ✅ |
| IconButton | `aria-label` obrigatório | Enter, Espaço | ✅ |
| TextField | `label` + `aria-describedby` (descrição, erro) + `aria-invalid` | nativo | ✅ |
| Checkbox | `input[type=checkbox]`, estado `indeterminate` | Espaço | ✅ |
| Switch | APG Switch: `role="switch"` + `aria-checked` | Espaço, Enter | ✅ |
| Select | `select` nativo com label, descrição e erro | nativo (setas, digitação) | ✅ |
| Tabs | APG Tabs, ativação automática, roving tabindex | ←/→, Home/End | pendente |
| Dialog | `aria-modal`, focus trap, fundo `inert`, retorno de foco | Tab/Shift+Tab presos, Esc fecha | pendente |
| Toast | região `role="status"` (`aria-live="polite"`) | botão de dispensar | pendente |
| Tooltip | APG Tooltip, `aria-describedby` | aparece no foco, Esc fecha | pendente |
| Badge | texto (nunca só cor) | — | pendente |
| Card | `section` rotulada pelo título, nível de heading configurável | — | pendente |
| Skeleton | decorativo (`aria-hidden`), container usa `aria-busy` | — | pendente |
| EmptyState | heading + descrição + ação | — | pendente |

## Instalação

```bash
npm install github:NasckDev/nasck-ui
```

```tsx
import '@nasckdev/nasck-ui/styles.css';
import { Button, TextField, ToastProvider } from '@nasckdev/nasck-ui';
import { tokens } from '@nasckdev/nasck-ui/tokens';

export function App() {
  return (
    <ToastProvider>
      <TextField label="E-mail" description="Nunca compartilhamos." />
      <Button>Salvar</Button>
    </ToastProvider>
  );
}
```

## Desenvolvimento

```bash
npm install
npm run storybook        # documentação interativa com addon-a11y
npm run test:coverage    # Vitest + Testing Library + axe-core
npm run lint && npm run typecheck
npm run build            # ESM + .d.ts + CSS
```

## Qualidade

- TypeScript `strict` + `noUncheckedIndexedAccess`, sem `any` (regra de lint).
- ESLint flat com `jsx-a11y` e `react-hooks`; `no-console` como erro.
- Testes de renderização, teclado e axe escritos para 6 componentes (ver tabela); os demais estão pendentes.
- Cobertura mínima de 80% configurada em `vite.config.ts`.
- CI no GitHub Actions: tokens sincronizados, lint, typecheck, testes, build e build do Storybook.
- Changelog e versionamento com Changesets.

Decisões de arquitetura estão em [`docs/adr/`](./docs/adr). Para contribuir, veja
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Licença

MIT © Alexandre Diogo Nascimento
