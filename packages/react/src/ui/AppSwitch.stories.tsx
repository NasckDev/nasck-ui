import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppSwitch } from './AppSwitch.tsx';

const meta = {
  title: 'Componentes/AppSwitch',
  component: AppSwitch,
  args: { label: 'Receber avisos por e-mail', onChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium'] } },
} satisfies Meta<typeof AppSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { checked: true },
};
export const Vazio: Story = { args: { checked: false } };
export const Desabilitado: Story = { args: { checked: true, disabled: true } };
export const Carregando: Story = {
  args: { checked: true, loading: true, label: 'Salvando preferência...' },
};
