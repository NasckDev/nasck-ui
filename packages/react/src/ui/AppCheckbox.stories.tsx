import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppCheckbox } from './AppCheckbox.tsx';

const meta = {
  title: 'Componentes/AppCheckbox',
  component: AppCheckbox,
  args: { label: 'Li e aceito os termos de uso', onChange: fn() },
} satisfies Meta<typeof AppCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { checked: true },
};
export const Vazio: Story = { args: { checked: false } };
export const Indeterminado: Story = {
  args: { indeterminate: true, label: 'Selecionar todas as faturas' },
};
export const Desabilitado: Story = { args: { checked: true, disabled: true } };
export const Erro: Story = {
  args: { checked: false, errorMessage: 'Aceite os termos para criar a conta.' },
};
