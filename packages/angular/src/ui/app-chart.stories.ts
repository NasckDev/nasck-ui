import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MONTHS, REVENUE, TICKETS } from '../sample-data';
import { template } from '../stories/helpers';
import { AppChartComponent } from './app-chart.component';

const INPUTS = [
  'type',
  'categories',
  'series',
  'title',
  'height',
  'loading',
  'emptyText',
  'ariaLabel',
  'valueFormat',
];

const meta: Meta<AppChartComponent> = {
  title: 'Componentes/AppChart',
  component: AppChartComponent,
  decorators: [moduleMetadata({ imports: [AppChartComponent] })],
  args: {
    type: 'area',
    title: 'Receita mensal',
    categories: MONTHS,
    series: [{ name: 'Receita', data: REVENUE }],
    valueFormat: 'currency',
    ariaLabel: 'Receita mensal de junho a novembro, em reais, crescendo de 48 mil para 66 mil',
    height: 300,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'area', 'bar', 'pie'] },
    valueFormat: { control: 'inline-radio', options: ['number', 'currency', 'percent'] },
    height: { control: { type: 'range', min: 160, max: 520, step: 20 } },
  },
  render: (args) => ({ props: args, template: template('app-chart', INPUTS) }),
};
export default meta;
type Story = StoryObj<AppChartComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Barras: Story = {
  args: {
    type: 'bar',
    title: 'Chamados por mês',
    series: [{ name: 'Chamados', data: TICKETS }],
    valueFormat: 'number',
    ariaLabel: 'Chamados por mês, em queda',
  },
};
export const Comparativo: Story = {
  args: {
    type: 'line',
    series: [
      { name: '2025', data: [41000, 43200, 44100, 47800, 50100, 52300] },
      { name: '2026', data: REVENUE },
    ],
  },
};
export const Rosca: Story = {
  args: {
    type: 'pie',
    title: 'Clientes por plano',
    categories: ['Essencial', 'Profissional', 'Empresarial'],
    series: [{ name: 'Clientes', data: [214, 96, 31] }],
    valueFormat: 'number',
    ariaLabel: 'Clientes por plano: 214 Essencial, 96 Profissional, 31 Empresarial',
  },
};
export const Carregando: Story = { args: { loading: true } };
export const Vazio: Story = {
  args: { series: [], emptyText: 'Sem receita neste período. Escolha outro intervalo.' },
};
