import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppTabsComponent } from './app-tabs.component';

const INPUTS = ['items', 'activeKey', 'type', 'size'];

const ITEMS = [
  { key: 'geral', label: 'Visão geral', content: 'Resumo da conta e atividade recente.' },
  { key: 'cobrancas', label: 'Cobranças', content: 'Faturas pagas e em aberto.' },
  { key: 'equipe', label: 'Equipe', content: 'Pessoas com acesso à conta.' },
  { key: 'api', label: 'Integrações', content: 'Chaves e webhooks.', disabled: true },
];

const meta: Meta<AppTabsComponent> = {
  title: 'Componentes/AppTabs',
  component: AppTabsComponent,
  decorators: [moduleMetadata({ imports: [AppTabsComponent] })],
  args: { items: ITEMS, activeKey: 'geral', activeKeyChange: fn() as never },
  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'card'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
  render: (args) => ({ props: args, template: template('app-tabs', INPUTS, ['activeKeyChange']) }),
};
export default meta;
type Story = StoryObj<AppTabsComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Cartao: Story = {
  name: 'Cartão',
  args: { type: 'card' },
};
export const Vazio: Story = { args: { items: [{ key: 'geral', label: 'Visão geral' }] } };
