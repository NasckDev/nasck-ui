import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppStatusComponent, AppTagComponent } from './app-tag.component';

const INPUTS = ['label', 'color', 'icon', 'closable', 'bordered'];

const meta: Meta<AppTagComponent> = {
  title: 'Componentes/AppTag',
  component: AppTagComponent,
  decorators: [moduleMetadata({ imports: [AppTagComponent, AppStatusComponent] })],
  args: { label: 'Em análise', color: 'info', closed: fn() as never },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'processing'],
    },
    icon: { control: 'select', options: [undefined, 'check', 'warning', 'info', 'bell'] },
  },
  render: (args) => ({ props: args, template: template('app-tag', INPUTS, ['closed']) }),
};
export default meta;
type Story = StoryObj<AppTagComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Fechavel: Story = {
  name: 'Fechável',
  args: { closable: true, label: 'Filtro: pendentes' },
};
export const ComIcone: Story = {
  name: 'Com ícone',
  args: { color: 'success', icon: 'check', label: 'Pago' },
};
export const Erro: Story = { args: { color: 'error', icon: 'warning', label: 'Vencido' } };
export const SemBorda: Story = {
  name: 'Sem borda',
  args: { bordered: false, color: 'warning', label: 'Pendente' },
};
export const Status: Story = {
  render: () => ({
    template: `<div style="display:flex;gap:24px;flex-wrap:wrap">
      <app-status status="success" label="Aprovado" />
      <app-status status="warning" label="Pendente" />
      <app-status status="error" label="Rejeitado" />
      <app-status status="info" label="Em análise" />
      <app-status status="processing" label="Processando" />
      <app-status status="default" label="Rascunho" />
    </div>`,
  }),
};
