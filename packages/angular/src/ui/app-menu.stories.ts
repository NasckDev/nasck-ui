import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppMenuComponent } from './app-menu.component';

const INPUTS = ['items', 'selectedKey', 'mode', 'collapsed'];

const ITEMS = [
  { key: 'inicio', label: 'Início', icon: 'home' as const },
  { key: 'clientes', label: 'Clientes', icon: 'user' as const },
  { key: 'avisos', label: 'Avisos', icon: 'bell' as const },
  { key: 'ajustes', label: 'Ajustes', icon: 'setting' as const },
  { key: 'faturamento', label: 'Faturamento', icon: 'mail' as const, disabled: true },
];

const meta: Meta<AppMenuComponent> = {
  title: 'Componentes/AppMenu',
  component: AppMenuComponent,
  decorators: [moduleMetadata({ imports: [AppMenuComponent] })],
  args: { items: ITEMS, selectedKey: 'clientes', selected: fn() as never },
  argTypes: { mode: { control: 'inline-radio', options: ['inline', 'horizontal', 'vertical'] } },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:${args.mode === 'horizontal' ? 640 : 260}px">${template('app-menu', INPUTS, ['selected'])}</div>`,
  }),
};
export default meta;
type Story = StoryObj<AppMenuComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Recolhido: Story = { args: { collapsed: true } };
export const Horizontal: Story = { args: { mode: 'horizontal' } };
export const Vazio: Story = { args: { items: [], selectedKey: undefined } };
