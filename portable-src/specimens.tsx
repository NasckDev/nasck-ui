// Especimes da pagina de entrada: os wrappers React de verdade, com o preset Nasck e o modo
// claro ou escuro que a pagina estiver usando (atributo data-theme do <html>).
import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import type { ThemeMode } from '@nasckdev/nasck-ui-tokens';
import { StrictMode, useState, useSyncExternalStore, type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { AppButton } from '../packages/react/src/ui/AppButton.tsx';
import { AppCheckbox } from '../packages/react/src/ui/AppCheckbox.tsx';
import { AppInput } from '../packages/react/src/ui/AppInput.tsx';
import { AppSwitch } from '../packages/react/src/ui/AppSwitch.tsx';
import { AppStatus, AppTag } from '../packages/react/src/ui/AppTag.tsx';
import { AppThemeProvider } from '../packages/react/src/ui/AppThemeProvider.tsx';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function readMode(): ThemeMode {
  return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
}

function usePageMode(): ThemeMode {
  return useSyncExternalStore(subscribe, readMode, () => 'light');
}

const row = { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' } as const;
const column = { display: 'flex', flexDirection: 'column', gap: 14 } as const;

function ButtonSpecimen(): ReactElement {
  return (
    <div style={row}>
      <AppButton variant="primary">Primária</AppButton>
      <AppButton>Secundária</AppButton>
      <AppButton variant="dashed">Tracejada</AppButton>
      <AppButton variant="text">Texto</AppButton>
      <AppButton variant="link">Link</AppButton>
      <AppButton variant="primary" loading>
        Salvando
      </AppButton>
    </div>
  );
}

function emailError(value: string): string | undefined {
  return EMAIL.test(value.trim()) ? undefined : 'Inclua o domínio completo, como empresa.com.br';
}

function InputSpecimen(): ReactElement {
  const [email, setEmail] = useState('ana@empresa');
  return (
    <AppInput
      type="email"
      label="E-mail do responsável"
      value={email}
      errorMessage={emailError(email)}
      onChange={setEmail}
    />
  );
}

function ChoiceSpecimen(): ReactElement {
  const [notify, setNotify] = useState(true);
  const [terms, setTerms] = useState(true);
  return (
    <div style={column}>
      <AppSwitch label="Notificar por e-mail" checked={notify} onChange={setNotify} />
      <AppCheckbox label="Aceito os termos de uso" checked={terms} onChange={setTerms} />
    </div>
  );
}

function TagSpecimen(): ReactElement {
  return (
    <div style={column}>
      <div style={row}>
        <AppTag label="Rascunho" />
        <AppTag label="Publicado" color="success" />
        <AppTag label="Em revisão" color="info" />
        <AppTag label="Atenção" color="warning" />
        <AppTag label="Recusado" color="error" />
      </div>
      <div style={row}>
        <AppStatus status="success" label="Pago" />
        <AppStatus status="warning" label="Vence hoje" />
        <AppStatus status="error" label="Atrasado" />
      </div>
    </div>
  );
}

const SPECIMENS: Record<string, () => ReactElement> = {
  button: ButtonSpecimen,
  input: InputSpecimen,
  choice: ChoiceSpecimen,
  tag: TagSpecimen,
};

function Themed({ name }: { name: string }): ReactElement | null {
  const mode = usePageMode();
  const Specimen = SPECIMENS[name];
  if (!Specimen) return null;
  return (
    <AppThemeProvider preset="nasck" mode={mode}>
      <Specimen />
    </AppThemeProvider>
  );
}

for (const host of document.querySelectorAll<HTMLElement>('[data-specimen]')) {
  const name = host.dataset['specimen'] ?? '';
  host.replaceChildren();
  createRoot(host).render(
    <StrictMode>
      <Themed name={name} />
    </StrictMode>,
  );
}
