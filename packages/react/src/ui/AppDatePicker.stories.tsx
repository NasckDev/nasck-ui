import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppDatePicker } from './AppDatePicker.tsx';

const meta = {
  title: 'Componentes/AppDatePicker',
  component: AppDatePicker,
  args: { label: 'Data de vencimento', onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
} satisfies Meta<typeof AppDatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { value: '2026-12-15', hint: 'O boleto vence às 23h59 desta data.' },
};
export const Vazio: Story = {};
export const Desabilitado: Story = { args: { value: '2026-12-15', disabled: true } };
export const Erro: Story = { args: { errorMessage: 'Escolha uma data a partir de amanhã.' } };
