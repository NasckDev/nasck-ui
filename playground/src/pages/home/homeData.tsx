import { Palette, ShieldCheck, Sparkles, SunMoon } from 'lucide-react';

import { Badge, type TableColumn } from '../../../../src';

export const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Acessível por padrão',
    text: 'HTML nativo primeiro, padrões do guia de acessibilidade do W3C, foco visível e teste de teclado e axe em cada componente.',
  },
  {
    icon: Palette,
    title: 'Tokens como fonte única',
    text: 'Cor, tipografia, espaço e movimento viram variáveis CSS geradas de um objeto tipado.',
  },
  {
    icon: SunMoon,
    title: 'Tema claro e escuro',
    text: 'Dois temas calibrados, com contraste AA calculado e um construtor para trocar o destaque.',
  },
  {
    icon: Sparkles,
    title: 'Leve e sem surpresas',
    text: 'Só depende de React. Movimento respeita prefers-reduced-motion e nada vem de CDN.',
  },
];

export interface Deal {
  id: string;
  client: string;
  value: number;
  stage: string;
}

export const DEALS: Deal[] = [
  { id: '1', client: 'Lumen Estúdio', value: 18400, stage: 'Proposta' },
  { id: '2', client: 'Cooperativa Alvorada', value: 52000, stage: 'Negociação' },
  { id: '3', client: 'Clínica Vértice', value: 9700, stage: 'Fechado' },
];

export const dealColumns: TableColumn<Deal>[] = [
  {
    id: 'client',
    header: 'Conta',
    cell: (row) => row.client,
    sortable: true,
    sortValue: (row) => row.client,
    isRowHeader: true,
  },
  {
    id: 'value',
    header: 'Valor',
    cell: (row) =>
      row.value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      }),
    sortable: true,
    sortValue: (row) => row.value,
    align: 'end',
  },
  {
    id: 'stage',
    header: 'Etapa',
    cell: (row) => (
      <Badge tone={row.stage === 'Fechado' ? 'success' : 'neutral'}>{row.stage}</Badge>
    ),
  },
];

export const PEOPLE = [
  'Marina Duarte',
  'Caio Fernandes',
  'Beatriz Nogueira',
  'Renan Albuquerque',
  'Sofia Tavares',
].map((name) => ({ name }));

export const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Porto Alegre',
  'Salvador',
].map((label) => ({
  value: label,
  label,
}));
