# Como contribuir

Obrigado pelo interesse! O Nasck UI prioriza acessibilidade e contratos estáveis.

## Fluxo

1. Abra uma issue descrevendo o problema ou o componente proposto (padrão APG de referência,
   comportamento de teclado e estados: default, hover, foco, disabled, loading, erro, vazio).
2. Crie uma branch a partir de `main`.
3. Implemente com testes primeiro: renderização, teclado e `axeViolations` sem violações.
4. Adicione/atualize a story com todos os estados e a seção de teclado na descrição.
5. Rode localmente:

   ```bash
   npm run lint && npm run typecheck && npm run test:coverage && npm run build
   ```

6. Registre a mudança com `npx changeset` (gera a entrada do CHANGELOG na release).
7. Abra o PR; a CI precisa estar verde.

## Regras

- Sem `any`, sem `console.log`, arquivos abaixo de ~400 linhas.
- Tokens são editados em `src/tokens/tokens.ts`; depois rode `npm run build:tokens`.
  Nunca edite `src/styles/tokens.css` à mão.
- HTML nativo antes de ARIA. ARIA só quando o elemento nativo não expressa o padrão.
- Commits em inglês, uma linha, com prefixo convencional (`feat:`, `fix:`, `docs:`...).
