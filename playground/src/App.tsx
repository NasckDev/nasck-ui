import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, ToastProvider } from '../../src';
import { componentDocs, findDoc } from './docs';
import type { ComponentDoc } from './docs/types';
import { ComponentPage } from './pages/ComponentPage';
import { ComposedPage } from './pages/ComposedPage';
import { HomePage } from './pages/HomePage';
import { TokensPage } from './pages/TokensPage';
import { href, useHashRoute } from './router';
import { useTheme } from './theme';

const GROUPS: ReadonlyArray<ComponentDoc['group']> = [
  'Ações',
  'Formulários',
  'Navegação e sobreposição',
  'Conteúdo e feedback',
];

const COMPONENT_PREFIX = '/componentes/';

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h12M3 9h12M3 13h12" strokeLinecap="round" />
  </svg>
);

function NavLink({ to, route, children }: { to: string; route: string; children: string }) {
  const active = route === to;
  return (
    <a className="pg-nav__link" href={href(to)} aria-current={active ? 'page' : undefined}>
      {children}
    </a>
  );
}

function Navigation({ route }: { route: string }) {
  return (
    <nav aria-label="Principal" className="pg-nav">
      <ul className="pg-nav__list">
        <li>
          <NavLink to="/" route={route}>
            Visão geral
          </NavLink>
        </li>
        <li>
          <NavLink to="/tokens" route={route}>
            Tokens
          </NavLink>
        </li>
        <li>
          <NavLink to="/exemplo" route={route}>
            Exemplo composto
          </NavLink>
        </li>
      </ul>
      {GROUPS.map((group) => (
        <div key={group}>
          <p className="pg-nav__group">{group}</p>
          <ul className="pg-nav__list">
            {componentDocs
              .filter((doc) => doc.group === group)
              .map((doc) => (
                <li key={doc.slug}>
                  <NavLink to={`${COMPONENT_PREFIX}${doc.slug}`} route={route}>
                    {doc.name}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NotFound() {
  return (
    <header className="pg-page-head">
      <h1 className="pg-h1" tabIndex={-1} id="page-title">
        Página não encontrada
      </h1>
      <p className="pg-lead">
        Essa rota não existe. <a href={href('/')}>Voltar para a visão geral</a>.
      </p>
    </header>
  );
}

function renderRoute(route: string) {
  if (route === '/') return <HomePage />;
  if (route === '/tokens') return <TokensPage />;
  if (route === '/exemplo') return <ComposedPage />;
  if (route.startsWith(COMPONENT_PREFIX)) {
    const doc = findDoc(route.slice(COMPONENT_PREFIX.length));
    if (doc) return <ComponentPage doc={doc} />;
  }
  return <NotFound />;
}

export function App() {
  const route = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    document.title = route === '/' ? 'Nasck UI · Playground' : `${routeTitle(route)} · Nasck UI`;
    // Move focus to the page heading on navigation, but not on the first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.querySelector<HTMLElement>('#page-title')?.focus({ preventScroll: true });
  }, [route]);

  return (
    <ToastProvider>
      <a
        className="pg-skip"
        href="#conteudo"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <header className="pg-topbar">
        <IconButton
          className="pg-topbar__menu"
          label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          icon={<MenuIcon />}
          aria-expanded={menuOpen}
          aria-controls="pg-sidebar"
          onClick={() => setMenuOpen((open) => !open)}
        />
        <a className="pg-brand" href={href('/')}>
          <span className="pg-brand__mark" aria-hidden="true">
            N
          </span>
          Nasck UI
        </a>
        <span className="pg-topbar__spacer" />
        <a
          className="pg-topbar__repo"
          href="https://github.com/NasckDev/nasck-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <Button variant="secondary" size="sm" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
          {theme === 'dark' ? 'Tema escuro' : 'Tema claro'}
        </Button>
      </header>
      <div className="pg-layout">
        <aside id="pg-sidebar" className="pg-sidebar" data-open={menuOpen}>
          <Navigation route={route} />
        </aside>
        <main id="conteudo" ref={mainRef} tabIndex={-1} className="pg-main">
          <div className="pg-main__inner">{renderRoute(route)}</div>
        </main>
      </div>
    </ToastProvider>
  );
}

function routeTitle(route: string): string {
  if (route === '/tokens') return 'Tokens';
  if (route === '/exemplo') return 'Exemplo composto';
  if (route.startsWith(COMPONENT_PREFIX)) {
    return findDoc(route.slice(COMPONENT_PREFIX.length))?.name ?? 'Não encontrada';
  }
  return 'Não encontrada';
}
