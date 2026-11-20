import {
  Accessibility,
  AppWindow,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleUserRound,
  CreditCard,
  Hourglass,
  Layers,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Menu as MenuIcon,
  MessageSquare,
  MousePointerClick,
  PanelTop,
  Palette,
  Rows3,
  Settings,
  SquareMousePointer,
  TableProperties,
  TextCursorInput,
  ToggleLeft,
  Type,
  Inbox,
  Home,
  Search as SearchIcon,
  Tag,
  ChevronsLeftRight,
  type LucideIcon,
} from 'lucide-react';
import { GROUPS, docMetas, type DocMeta } from './docs';

export interface NavEntry {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Extra words the search matches (synonyms, English names). */
  keywords: string;
  group: string;
}

const SLUG_ICON: Record<string, LucideIcon> = {
  button: MousePointerClick,
  'icon-button': SquareMousePointer,
  'text-field': TextCursorInput,
  checkbox: ListChecks,
  switch: ToggleLeft,
  select: ChevronsUpDown,
  combobox: SearchIcon,
  tabs: PanelTop,
  dialog: AppWindow,
  toast: Bell,
  tooltip: MessageSquare,
  accordion: Rows3,
  menu: MenuIcon,
  table: TableProperties,
  pagination: ChevronsLeftRight,
  avatar: CircleUserRound,
  badge: Tag,
  card: Layers,
  skeleton: Hourglass,
  'empty-state': Inbox,
};

export const iconFor = (slug: string): LucideIcon => SLUG_ICON[slug] ?? Type;

export const COMPONENT_PREFIX = '/componentes/';
export const TEMPLATE_PREFIX = '/modelos/';

export const TEMPLATES = [
  {
    slug: 'painel',
    label: 'Painel',
    icon: LayoutDashboard,
    summary: 'Indicadores, receita, tabela ordenável com paginação e menu de ações.',
    keywords: 'dashboard admin tabela kpi',
  },
  {
    slug: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    summary: 'Perfil com validação, notificações, equipe e exclusão com confirmação.',
    keywords: 'settings perfil formulário',
  },
  {
    slug: 'login',
    label: 'Login',
    icon: LogIn,
    summary: 'Entrada com validação, mostrar senha, estado de carregamento e SSO.',
    keywords: 'entrar senha autenticação',
  },
] as const;

export const PAGE_ICONS = {
  home: Home,
  tokens: Palette,
  a11y: Accessibility,
  check: BadgeCheck,
  card: CreditCard,
};

export const buildEntries = (): NavEntry[] => [
  { to: '/', label: 'Visão geral', icon: Home, keywords: 'início home começar', group: 'Começar' },
  {
    to: '/tokens',
    label: 'Tokens e construtor de tema',
    icon: Palette,
    keywords: 'cores tema contraste css tipografia espaço design tokens',
    group: 'Fundamentos',
  },
  ...TEMPLATES.map((template) => ({
    to: `${TEMPLATE_PREFIX}${template.slug}`,
    label: `Modelo: ${template.label}`,
    icon: template.icon,
    keywords: template.keywords,
    group: 'Modelos',
  })),
  ...docMetas.map((doc) => ({
    to: `${COMPONENT_PREFIX}${doc.slug}`,
    label: doc.name,
    icon: iconFor(doc.slug),
    keywords: `${doc.summary} ${doc.group} ${doc.slug}`,
    group: 'Componentes',
  })),
];

export const componentsByGroup = (): ReadonlyArray<{ group: DocMeta['group']; docs: DocMeta[] }> =>
  GROUPS.map((group) => ({ group, docs: docMetas.filter((doc) => doc.group === group) }));
