import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppIconButton } from './AppIconButton.tsx';

const meta = {
  title: 'Componentes/AppIconButton',
  component: AppIconButton,
  args: { icon: 'edit', label: 'Editar cliente', onClick: fn() },
  argTypes: {
    icon: {
      control: 'select',
      options: ['edit', 'delete', 'plus', 'search', 'more', 'reload', 'setting'],
    },
    variant: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof AppIconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Carregando: Story = { args: { loading: true } };
export const Erro: Story = { args: { icon: 'delete', danger: true, label: 'Excluir cliente' } };
export const Vazio: Story = {
  args: { icon: 'plus', variant: 'dashed', label: 'Adicionar cliente' },
};
