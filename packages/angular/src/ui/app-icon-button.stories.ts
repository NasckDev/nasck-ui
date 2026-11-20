import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppIconButtonComponent } from './app-icon-button.component';

const INPUTS = ['icon', 'label', 'variant', 'size', 'loading', 'disabled', 'danger'];

const meta: Meta<AppIconButtonComponent> = {
  title: 'Componentes/AppIconButton',
  component: AppIconButtonComponent,
  decorators: [moduleMetadata({ imports: [AppIconButtonComponent] })],
  args: { icon: 'edit', label: 'Editar cliente', clicked: fn() as never },
  argTypes: {
    icon: {
      control: 'select',
      options: ['edit', 'delete', 'plus', 'search', 'more', 'reload', 'setting'],
    },
    variant: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
  render: (args) => ({ props: args, template: template('app-icon-button', INPUTS, ['clicked']) }),
};
export default meta;
type Story = StoryObj<AppIconButtonComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Carregando: Story = { args: { loading: true } };
export const Erro: Story = { args: { icon: 'delete', danger: true, label: 'Excluir cliente' } };
export const Vazio: Story = {
  args: { icon: 'plus', variant: 'dashed', label: 'Adicionar cliente' },
};
