import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppTabs } from './AppTabs.tsx';

const ITEMS = [
  { key: 'geral', label: 'Visão geral', content: 'Resumo da conta e atividade recente.' },
  { key: 'cobrancas', label: 'Cobranças', content: 'Faturas pagas e em aberto.' },
  { key: 'equipe', label: 'Equipe', content: 'Pessoas com acesso à conta.' },
  { key: 'api', label: 'Integrações', content: 'Chaves e webhooks.', disabled: true },
];

const meta = {
  title: 'Componentes/AppTabs',
  component: AppTabs,
  args: { items: ITEMS, activeKey: 'geral', onChange: fn() },
  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'card'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof AppTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Cartao: Story = {
  name: 'Cartão',
  args: { type: 'card' },
};
export const Vazio: Story = { args: { items: [{ key: 'geral', label: 'Visão geral' }] } };
