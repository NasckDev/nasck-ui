import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppButtonComponent } from './app-button.component';

const INPUTS = ['variant', 'size', 'loading', 'disabled', 'icon', 'danger', 'block', 'htmlType'];

const meta: Meta<AppButtonComponent & { label: string }> = {
  title: 'Componentes/AppButton',
  component: AppButtonComponent,
  decorators: [moduleMetadata({ imports: [AppButtonComponent] })],
  args: { label: 'Salvar alterações', clicked: fn() as never },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    icon: {
      control: 'select',
      options: [undefined, 'plus', 'download', 'delete', 'edit', 'reload'],
    },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
  render: (args) => ({
    props: args,
    template: template('app-button', INPUTS, ['clicked'], '{{ label }}'),
  }),
};
export default meta;
type Story = StoryObj<AppButtonComponent & { label: string }>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { variant: 'primary' },
};
export const Desabilitado: Story = { args: { variant: 'primary', disabled: true } };
export const Carregando: Story = {
  args: { variant: 'primary', loading: true, label: 'Salvando...' },
};
export const Erro: Story = {
  args: { variant: 'primary', danger: true, icon: 'delete', label: 'Excluir conta' },
};
export const Vazio: Story = {
  args: { variant: 'dashed', icon: 'plus', label: 'Adicionar primeiro item' },
};
export const Variantes: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:12px;flex-wrap:wrap">
      <app-button variant="primary">primary</app-button>
      <app-button variant="default">default</app-button>
      <app-button variant="dashed">dashed</app-button>
      <app-button variant="text">text</app-button>
      <app-button variant="link">link</app-button>
    </div>`,
  }),
};
