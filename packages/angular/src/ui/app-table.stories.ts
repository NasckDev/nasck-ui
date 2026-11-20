import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { SAMPLE_COLUMNS, SAMPLE_ROWS } from '../sample-data';
import { template } from '../stories/helpers';
import { AppTableComponent } from './app-table.component';

const INPUTS = [
  'columns',
  'data',
  'rowKey',
  'loading',
  'emptyText',
  'pageSize',
  'pagination',
  'size',
];

const meta: Meta<AppTableComponent> = {
  title: 'Componentes/AppTable',
  component: AppTableComponent,
  decorators: [moduleMetadata({ imports: [AppTableComponent] })],
  args: { columns: SAMPLE_COLUMNS, data: SAMPLE_ROWS, rowKey: 'id', rowClick: fn() as never },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
  render: (args) => ({ props: args, template: template('app-table', INPUTS, ['rowClick']) }),
};
export default meta;
type Story = StoryObj<AppTableComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Paginada: Story = { args: { pageSize: 3 } };
export const Carregando: Story = { args: { loading: true } };
export const Vazio: Story = {
  args: {
    data: [],
    emptyText: 'Nenhum cliente encontrado. Ajuste os filtros ou cadastre um cliente.',
  },
};
export const Erro: Story = {
  args: {
    data: [],
    emptyText: 'Não foi possível carregar os clientes. Verifique a conexão e tente de novo.',
  },
};
