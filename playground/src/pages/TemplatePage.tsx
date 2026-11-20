import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from '../../../src';
import { TEMPLATES } from '../nav';
import { DashboardTemplate } from './templates/Dashboard';
import { LoginTemplate } from './templates/Login';
import { SettingsTemplate } from './templates/Settings';

const VIEWS = {
  painel: DashboardTemplate,
  configuracoes: SettingsTemplate,
  login: LoginTemplate,
} as const;

type Slug = keyof typeof VIEWS;

export function TemplatePage({ slug }: { slug: string }) {
  const template = TEMPLATES.find((item) => item.slug === slug);
  const [frameTheme, setFrameTheme] = useState<'inherit' | 'light' | 'dark'>('inherit');
  if (!template) return null;
  const View = VIEWS[slug as Slug];

  return (
    <>
      <header className="pg-page-head">
        <p className="pg-eyebrow">
          <template.icon size={14} aria-hidden="true" /> Modelos
        </p>
        <h1 className="pg-h1" tabIndex={-1} id="page-title">
          {template.label}
        </h1>
        <p className="pg-lead">
          {template.summary} Tela completa montada apenas com componentes do Nasck UI, ícones e CSS
          de layout.
        </p>
      </header>
      <section aria-label={`Modelo ${template.label}`} className="pg-section">
        <div className="pg-frame-bar">
          <span className="pg-frame-bar__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="pg-frame-bar__url">app.exemplo.com.br/{slug}</span>
          <IconButton
            size="sm"
            label={
              frameTheme === 'dark'
                ? 'Mostrar o modelo em tema claro'
                : 'Mostrar o modelo em tema escuro'
            }
            icon={frameTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            onClick={() => setFrameTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          />
        </div>
        <div className="pg-frame" data-theme={frameTheme === 'inherit' ? undefined : frameTheme}>
          <View />
        </div>
        <p className="pg-note">
          Os dados são fictícios. Os dados de exemplo e as ações funcionam: ordene, pagine e
          experimente os fluxos.
        </p>
      </section>
    </>
  );
}
