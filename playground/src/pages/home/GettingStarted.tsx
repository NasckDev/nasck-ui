import { CodeBlock } from '../../components/CodeBlock';

const INSTALL_STEP = [
  'npm install github:NasckDev/nasck-ui react react-dom',
  'npm install @fontsource-variable/space-grotesk @fontsource-variable/dm-sans @fontsource/space-mono',
].join('\n');

const ENTRY_STEP = [
  "import { StrictMode } from 'react';",
  "import { createRoot } from 'react-dom/client';",
  "import '@fontsource-variable/space-grotesk/wght.css';",
  "import '@fontsource-variable/dm-sans/wght.css';",
  "import '@fontsource/space-mono/latin-400.css';",
  "import '@nasckdev/nasck-ui/styles.css';",
  "import { App } from './App';",
  '',
  "createRoot(document.getElementById('root')!).render(",
  '  <StrictMode>',
  '    <App />',
  '  </StrictMode>,',
  ');',
].join('\n');

const APP_STEP = [
  "import { Button, TextField, ToastProvider, useToast } from '@nasckdev/nasck-ui';",
  '',
  'function InviteForm() {',
  '  const { toast } = useToast();',
  '  return (',
  '    <form',
  '      onSubmit={(event) => {',
  '        event.preventDefault();',
  "        toast({ title: 'Convite enviado', tone: 'success' });",
  '      }}',
  '    >',
  '      <TextField label="E-mail" type="email" required description="Nunca compartilhamos." />',
  '      <Button type="submit">Enviar convite</Button>',
  '    </form>',
  '  );',
  '}',
  '',
  'export function App() {',
  '  return (',
  '    <ToastProvider>',
  '      <InviteForm />',
  '    </ToastProvider>',
  '  );',
  '}',
].join('\n');

/** Complete, runnable setup: install, fonts and styles, and a minimal app. */
export function GettingStarted() {
  return (
    <section aria-labelledby="sec-comecar" className="pg-section" id="comecar">
      <p className="pg-eyebrow">Começar</p>
      <h2 id="sec-comecar" className="pg-h2" tabIndex={-1}>
        Do zero a um formulário funcionando
      </h2>
      <p className="pg-note">
        Funciona com React 19. A instalação pelo GitHub compila a biblioteca na hora (precisa de
        Node 22.18 ou mais novo). As fontes ficam por sua conta, para você decidir como carregá-las.
      </p>
      <ol className="pg-steps">
        <li>
          <h3 className="pg-h3">1. Instale</h3>
          <CodeBlock code={INSTALL_STEP} label="Instalação" lang="bash" />
        </li>
        <li>
          <h3 className="pg-h3">2. Importe fontes e estilos uma vez, na entrada do app</h3>
          <CodeBlock code={ENTRY_STEP} label="Arquivo de entrada main.tsx" />
        </li>
        <li>
          <h3 className="pg-h3">3. Use os componentes</h3>
          <CodeBlock code={APP_STEP} label="Exemplo mínimo App.tsx" />
        </li>
      </ol>
      <p className="pg-note">
        Tema escuro: coloque <code>data-theme=&quot;dark&quot;</code> no elemento{' '}
        <code>&lt;html&gt;</code>. Sem o atributo, o tema segue a preferência do sistema.
      </p>
    </section>
  );
}
