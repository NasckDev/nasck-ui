# Como contribuir

O Nasck UI é a referência do contrato de wrappers dos projetos. Mudar o contrato é mudar o que os apps seguem.

## Fluxo

1. Altere `contract/contract.json` primeiro (nome do componente, props, eventos, seletor).
2. Implemente o wrapper nos dois pacotes: `packages/react/src/ui/` e `packages/angular/src/ui/`.
   Nada de importar `antd` ou `ng-zorro-antd` fora de `src/ui/` (o lint barra).
3. Escreva a story com os estados padrão, desabilitado, carregando, erro e vazio, quando fizer sentido,
   e controles nas props mais usadas.
4. Rode o que o CI roda:

   ```bash
   npm run lint && npm run typecheck && npm run test
   npm run build-storybook && npm run build:portable
   npm run test:e2e
   ```

5. Abra o PR; o CI precisa estar verde.

## Regras

- TypeScript estrito, sem `any`, sem `console.log`, arquivos abaixo de ~400 linhas.
- Cores, espaçamentos, raios e fontes vêm do tema (`packages/tokens`). Nada de cor ou px fixo nos componentes.
- Versões exatas no `package.json`, sem `^` nem `~`. Confira a licença (MIT ou Apache 2.0).
- Documentação em pt-BR; código e commits em inglês, uma linha.
