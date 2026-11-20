import {
  BarChart3,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { BadgeTone } from '../../../../src';

export interface Invoice {
  id: string;
  client: string;
  owner: string;
  amount: number;
  due: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

export const INVOICES: Invoice[] = [
  {
    id: 'F-2041',
    client: 'Lumen Estúdio',
    owner: 'Marina Duarte',
    amount: 4820.5,
    due: '2026-11-28',
    status: 'Pago',
  },
  {
    id: 'F-2042',
    client: 'Cooperativa Alvorada',
    owner: 'Caio Fernandes',
    amount: 12900,
    due: '2026-12-02',
    status: 'Pendente',
  },
  {
    id: 'F-2043',
    client: 'Mercado Beira-Rio',
    owner: 'Beatriz Nogueira',
    amount: 780.9,
    due: '2026-11-10',
    status: 'Atrasado',
  },
  {
    id: 'F-2044',
    client: 'Clínica Vértice',
    owner: 'Marina Duarte',
    amount: 3150,
    due: '2026-12-05',
    status: 'Pago',
  },
  {
    id: 'F-2045',
    client: 'Oficina do Tato',
    owner: 'Renan Albuquerque',
    amount: 1290.75,
    due: '2026-12-09',
    status: 'Pendente',
  },
  {
    id: 'F-2046',
    client: 'Escola Girassol',
    owner: 'Sofia Tavares',
    amount: 8640,
    due: '2026-11-15',
    status: 'Atrasado',
  },
  {
    id: 'F-2047',
    client: 'Padaria Estrela',
    owner: 'Caio Fernandes',
    amount: 420,
    due: '2026-12-12',
    status: 'Pago',
  },
  {
    id: 'F-2048',
    client: 'Instituto Horizonte',
    owner: 'Beatriz Nogueira',
    amount: 15700,
    due: '2026-12-18',
    status: 'Pendente',
  },
  {
    id: 'F-2049',
    client: 'Grupo Vale Verde',
    owner: 'Otávio Lins',
    amount: 22300,
    due: '2026-12-20',
    status: 'Pago',
  },
  {
    id: 'F-2050',
    client: 'Ótica Panorama',
    owner: 'Renan Albuquerque',
    amount: 2260,
    due: '2026-12-22',
    status: 'Pendente',
  },
  {
    id: 'F-2051',
    client: 'Transportes Aurora',
    owner: 'Marina Duarte',
    amount: 9980,
    due: '2026-12-27',
    status: 'Pago',
  },
  {
    id: 'F-2052',
    client: 'Livraria Marginal',
    owner: 'Sofia Tavares',
    amount: 1180.4,
    due: '2027-01-03',
    status: 'Pendente',
  },
];

export const PAGE_SIZE = 5;
export const TONE: Record<Invoice['status'], BadgeTone> = {
  Pago: 'success',
  Pendente: 'warning',
  Atrasado: 'danger',
};
export const brl = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const date = (iso: string): string =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export const TOP_COLLECTORS = [
  { name: 'Marina Duarte', amount: 21400 },
  { name: 'Caio Fernandes', amount: 15800 },
  { name: 'Sofia Tavares', amount: 9200 },
];

export const MONTHS = [
  { label: 'jun', value: 48 },
  { label: 'jul', value: 56 },
  { label: 'ago', value: 52 },
  { label: 'set', value: 67 },
  { label: 'out', value: 72 },
  { label: 'nov', value: 81 },
];

export const MONTHS_12 = [
  { label: 'dez', value: 38 },
  { label: 'jan', value: 41 },
  { label: 'fev', value: 39 },
  { label: 'mar', value: 45 },
  { label: 'abr', value: 44 },
  { label: 'mai', value: 50 },
  ...MONTHS,
];

export interface Kpi {
  label: string;
  value: string;
  /** Text shown in the indicator. Uses the real minus sign (U+2212). */
  change: string;
  /** Direction of the number; whether it is good news is a separate flag. */
  trend: 'up' | 'down';
  good: boolean;
  /** Read by screen readers after the number. */
  description: string;
  icon: LucideIcon;
}

export const KPIS: Kpi[] = [
  {
    label: 'Receita do mês',
    value: 'R$ 81,2 mil',
    change: '+12,4%',
    trend: 'up',
    good: true,
    description: 'alta, favorável, em relação a outubro',
    icon: CircleDollarSign,
  },
  {
    label: 'Faturas em aberto',
    value: '14',
    change: '−3',
    trend: 'down',
    good: true,
    description: 'queda, favorável, em relação a outubro',
    icon: FileText,
  },
  {
    label: 'Clientes ativos',
    value: '212',
    change: '+9',
    trend: 'up',
    good: true,
    description: 'alta, favorável, em relação a outubro',
    icon: Users,
  },
  {
    label: 'Inadimplência',
    value: '3,8%',
    change: '+0,6 p.p.',
    trend: 'up',
    good: false,
    description: 'alta, desfavorável, em relação a outubro',
    icon: BarChart3,
  },
];

export const NAV = [
  { label: 'Painel', icon: LayoutDashboard, current: true },
  { label: 'Faturas', icon: FileText },
  { label: 'Clientes', icon: Users },
  { label: 'Ajustes', icon: Settings },
];
