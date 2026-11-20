import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppDropdown } from './AppDropdown.tsx';

const ITEMS = [
  { key: 'editar', label: 'Editar cliente', icon: 'edit' as const },
  { key: 'exportar', label: 'Exportar dados', icon: 'download' as const },
  { key: 'arquivar', label: 'Arquivar', disabled: true },
  { key: 'excluir', label: 'Excluir cliente', icon: 'delete' as const, danger: true },
];

const meta = {
  title: 'Componentes/AppDropdown',
  component: AppDropdown,
  args: { items: ITEMS, label: 'Ações', onSelect: fn() },
  argTypes: {
    trigger: { control: 'inline-radio', options: ['click', 'hover'] },
    placement: { control: 'select', options: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppDropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const ComIcone: Story = {
  name: 'Com ícone',
  args: { icon: 'setting', label: 'Configurar' },
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Vazio: Story = { args: { items: [] } };
