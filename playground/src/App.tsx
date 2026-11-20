import { Home, Menu as MenuIcon, Moon, Palette, Search, Sun, X } from 'lucide-react';
import { Github } from './components/GithubIcon';
import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IconButton, Skeleton, ToastProvider } from '../../src';
import { CommandPalette } from './components/CommandPalette';
import { Logo } from './components/Logo';
import { findMeta } from './docs';
import {
  COMPONENT_PREFIX,
  TEMPLATES,
  TEMPLATE_PREFIX,
  buildEntries,
  componentsByGroup,
  iconFor,
} from './nav';
import { ComponentRoute } from './pages/ComponentRoute';
import { HomePage } from './pages/HomePage';
import { href, useHashRoute } from './router';
import { useTheme } from './theme';

// Heavy routes (theme builder and template screens) load on demand.
const TokensPage = lazy(() =>
  import('./pages/TokensPage').then((m) => ({ default: m.TokensPage })),
);
const TemplatePage = lazy(() =>
  import('./pages/TemplatePage').then((m) => ({ default: m.TemplatePage })),
);

const DESKTOP_QUERY = '(min-width: 60rem)';
const isApple = (): boolean => {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /Mac|iPhone|iPad/.test(nav.userAgentData?.platform ?? navigator.userAgent);
};

const SEARCH_HINT = isApple() ? '⌘K' : 'Ctrl K';

function NavLink({
  to,
  route,
  icon: Icon,
  children,
}: {
  to: string;
  route: string;
  icon: typeof Home;
  children: ReactNode;
}) {
  const active = route === to;
  return (
    <a className="pg-nav__link" href={href(to)} aria-current={active ? 'page' : undefined}>
      <Icon size={16} aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

function Navigation({ route }: { route: string }) {
  const groups = useMemo(componentsByGroup, []);
  return (
    <nav aria-label="Principal" className="pg-nav">
      <ul className="pg-nav__list">
        <li>
          <NavLink to="/" route={route} icon={Home}>
            Visão geral
          </NavLink>
        </li>
        <li>
          <NavLink to="/tokens" route={route} icon={Palette}>
            Tokens e tema
          </NavLink>
        </li>
      </ul>
      <p className="pg-nav__group">Modelos</p>
      <ul className="pg-nav__list">
        {TEMPLATES.map((template) => (
          <li key={template.slug}>
            <NavLink to={`${TEMPLATE_PREFIX}${template.slug}`} route={route} icon={template.icon}>
              {template.label}
            </NavLink>
          </li>
        ))}
      </ul>
      {groups.map(({ group, docs }) => (
        <div key={group}>
          <p className="pg-nav__group">{group}</p>
          <ul className="pg-nav__list">
            {docs.map((doc) => (
              <li key={doc.slug}>
                <NavLink
                  to={`${COMPONENT_PREFIX}${doc.slug}`}
                  route={route}
                  icon={iconFor(doc.slug)}
                >
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

function RouteFallback() {
  return (
    <div aria-busy="true" data-route-loading>
      <h1 className="pg-h1" id="page-title" tabIndex={-1}>
        Carregando…
      </h1>
      <Skeleton lines={4} />
    </div>
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
  if (route.startsWith(TEMPLATE_PREFIX)) {
    const slug = route.slice(TEMPLATE_PREFIX.length);
    if (TEMPLATES.some((template) => template.slug === slug)) return <TemplatePage slug={slug} />;
  }
  if (route.startsWith(COMPONENT_PREFIX)) {
    const slug = route.slice(COMPONENT_PREFIX.length);
    if (findMeta(slug)) return <ComponentRoute slug={slug} />;
  }
  return <NotFound />;
}

function routeTitle(route: string): string {
  if (route === '/tokens') return 'Tokens e tema';
  if (route.startsWith(TEMPLATE_PREFIX)) {
    return `Modelo ${TEMPLATES.find((template) => template.slug === route.slice(TEMPLATE_PREFIX.length))?.label ?? ''}`.trim();
  }
  if (route.startsWith(COMPONENT_PREFIX)) {
    return findMeta(route.slice(COMPONENT_PREFIX.length))?.name ?? 'Não encontrada';
  }
  return 'Não encontrada';
}

export function App() {
  const route = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const restoreMenuFocus = useRef(false);
  const entries = useMemo(buildEntries, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
    document.title =
      route === '/' ? 'Nasck UI · Design system acessível' : `${routeTitle(route)} · Nasck UI`;
    // Move focus to the page heading on navigation, but not on the first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.querySelector<HTMLElement>('#page-title')?.focus({ preventScroll: true });
  }, [route]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Drawer behavior on small screens: focus the first link, Esc closes and restores focus.
  useEffect(() => {
    if (!menuOpen) return undefined;
    sidebarRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      restoreMenuFocus.current = true;
      setMenuOpen(false);
    };
    const media = window.matchMedia(DESKTOP_QUERY);
    const handleMedia = () => media.matches && setMenuOpen(false);
    document.addEventListener('keydown', handleKeyDown);
    media.addEventListener('change', handleMedia);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      media.removeEventListener('change', handleMedia);
    };
  }, [menuOpen]);

  // The header is `inert` while the drawer is open, so focus returns only after it re-renders.
  useEffect(() => {
    if (menuOpen || !restoreMenuFocus.current) return;
    restoreMenuFocus.current = false;
    menuButtonRef.current?.focus();
  }, [menuOpen]);

  const navigate = (to: string) => {
    window.location.hash = `#${to}`;
  };

  return (
    <ToastProvider>
      <div id="app-shell" className="pg-shell">
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
        <header className="pg-topbar" inert={menuOpen ? true : undefined}>
          <IconButton
            ref={menuButtonRef}
            className="pg-topbar__menu"
            label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            icon={menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            aria-expanded={menuOpen}
            aria-controls="pg-sidebar"
            onClick={() => setMenuOpen((open) => !open)}
          />
          <a className="pg-brand" href={href('/')} aria-label="Nasck UI, visão geral">
            <Logo />
          </a>
          <span className="pg-topbar__spacer" />
          <button
            type="button"
            className="pg-search nui-focusable"
            onClick={() => setSearchOpen(true)}
            aria-label={`Buscar ${SEARCH_HINT}`}
          >
            <Search size={16} aria-hidden="true" />
            <span className="pg-search__text">Buscar</span>{' '}
            <kbd className="pg-search__kbd" aria-hidden="true">
              {SEARCH_HINT}
            </kbd>
          </button>
          <a
            className="pg-icon-link nui-focusable"
            href="https://github.com/NasckDev/nasck-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repositório no GitHub (abre em nova aba)"
          >
            <Github size={18} />
          </a>
          <IconButton
            variant="ghost"
            label={theme === 'dark' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
            icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          />
        </header>
        <div className="pg-layout">
          {menuOpen ? (
            // The backdrop is a pointer-only convenience; keyboard users close the drawer with Esc.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="pg-backdrop" onClick={() => setMenuOpen(false)} />
          ) : null}
          <aside id="pg-sidebar" ref={sidebarRef} className="pg-sidebar" data-open={menuOpen}>
            <Navigation route={route} />
          </aside>
          <main
            id="conteudo"
            ref={mainRef}
            tabIndex={-1}
            className="pg-main"
            inert={menuOpen ? true : undefined}
          >
            <div
              className={
                route.startsWith(TEMPLATE_PREFIX)
                  ? 'pg-main__inner pg-main__inner--wide'
                  : 'pg-main__inner'
              }
              key={route}
            >
              <Suspense fallback={<RouteFallback />}>{renderRoute(route)}</Suspense>
            </div>
            <footer className="pg-footer">
              <Logo size={20} />
              <p>
                Código aberto sob licença MIT. Feito por Alexandre Diogo Nascimento ·{' '}
                <a
                  href="https://github.com/NasckDev/nasck-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </p>
            </footer>
          </main>
        </div>
      </div>
      <CommandPalette
        open={searchOpen}
        entries={entries}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />
    </ToastProvider>
  );
}
