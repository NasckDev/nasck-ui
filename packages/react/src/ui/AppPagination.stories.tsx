import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppPagination } from './AppPagination.tsx';

const meta = {
  title: 'Componentes/AppPagination',
  component: AppPagination,
  args: { current: 2, total: 86, pageSize: 10, onChange: fn() },
} satisfies Meta<typeof AppPagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const ComTamanhoDePagina: Story = {
  name: 'Com tamanho de página',
  args: { showSizeChanger: true },
};
export const Simples: Story = { args: { simple: true } };
export const Desabilitado: Story = { args: { disabled: true } };
export const Vazio: Story = { args: { total: 0, current: 1 } };
