import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppDropdownComponent } from './app-dropdown.component';

const INPUTS = ['items', 'label', 'trigger', 'placement', 'disabled', 'icon'];

const ITEMS = [
  { key: 'editar', label: 'Editar cliente', icon: 'edit' as const },
  { key: 'exportar', label: 'Exportar dados', icon: 'download' as const },
  { key: 'arquivar', label: 'Arquivar', disabled: true },
  { key: 'excluir', label: 'Excluir cliente', icon: 'delete' as const, danger: true },
];

const meta: Meta<AppDropdownComponent> = {
  title: 'Componentes/AppDropdown',
  component: AppDropdownComponent,
  decorators: [moduleMetadata({ imports: [AppDropdownComponent] })],
  args: { items: ITEMS, label: 'Ações', selected: fn() as never },
  argTypes: {
    trigger: { control: 'inline-radio', options: ['click', 'hover'] },
    placement: { control: 'select', options: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] },
  },
  render: (args) => ({
    props: args,
    template: `<div style="min-height:240px">${template('app-dropdown', INPUTS, ['selected'])}</div>`,
  }),
};
export default meta;
type Story = StoryObj<AppDropdownComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const ComIcone: Story = {
  name: 'Com ícone',
  args: { icon: 'setting', label: 'Configurar' },
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Vazio: Story = { args: { items: [] } };
