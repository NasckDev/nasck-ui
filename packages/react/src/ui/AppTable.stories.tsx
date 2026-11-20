import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppTable } from './AppTable.tsx';
import { SAMPLE_COLUMNS, SAMPLE_ROWS } from '../sample-data.ts';

const meta = {
  title: 'Componentes/AppTable',
  component: AppTable,
  args: { columns: SAMPLE_COLUMNS, data: SAMPLE_ROWS, rowKey: 'id', onRowClick: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
} satisfies Meta<typeof AppTable>;
export default meta;
type Story = StoryObj<typeof meta>;

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
