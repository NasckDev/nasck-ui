# ADR 0002 — HTML nativo antes de ARIA

- Status: substituído pelo ADR 0004 (histórico do código legado, tag v0.2.0-legacy)
- Data: 2026-11-19

## Contexto

Reimplementações de checkbox, select e botão com `div` perdiam teclado, formulário e semântica.

## Decisão

Usar elementos nativos (`button`, `input`, `select`, `label`) sempre que existirem. ARIA é usada
apenas para padrões sem equivalente nativo, seguindo o WAI-ARIA Authoring Practices Guide:
Switch (`role="switch"`), Tabs (roving tabindex), Dialog (`aria-modal` + focus trap + `inert`),
Tooltip (`aria-describedby`) e Toast (`role="status"`).

## Consequências

- Select é nativo: menos customização visual da lista, mas suporte completo a teclado, leitores de
  tela e pickers mobile. Para listas longas existe o Combobox (padrão APG com aria-activedescendant).
- O Dialog usa portal + `inert` nos irmãos em vez de `<dialog>` para ter controle testável do foco.
