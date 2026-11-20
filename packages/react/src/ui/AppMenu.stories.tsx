import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppMenu } from './AppMenu.tsx';

const ITEMS = [
  { key: 'inicio', label: 'Início', icon: 'home' as const },
  { key: 'clientes', label: 'Clientes', icon: 'user' as const },
  { key: 'avisos', label: 'Avisos', icon: 'bell' as const },
  { key: 'ajustes', label: 'Ajustes', icon: 'setting' as const },
  { key: 'faturamento', label: 'Faturamento', icon: 'mail' as const, disabled: true },
];

const meta = {
  title: 'Componentes/AppMenu',
  component: AppMenu,
  args: { items: ITEMS, selectedKey: 'clientes', onSelect: fn() },
  argTypes: { mode: { control: 'inline-radio', options: ['inline', 'horizontal', 'vertical'] } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Recolhido: Story = { args: { collapsed: true } };
export const Horizontal: Story = {
  args: { mode: 'horizontal' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};
export const Vazio: Story = { args: { items: [], selectedKey: undefined } };
