import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppCard } from './AppCard.tsx';

const meta = {
  title: 'Componentes/AppCard',
  component: AppCard,
  args: {
    title: 'Resumo da conta',
    extra: 'Atualizado hoje',
    children: 'Plano Profissional com 18 usuários ativos. Próxima cobrança em 05/12.',
  },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'small'] } },
} satisfies Meta<typeof AppCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { hoverable: true, bordered: false } };
export const Carregando: Story = { args: { loading: true } };
export const Erro: Story = {
  args: {
    title: 'Cobranças',
    children: 'Não foi possível carregar as cobranças. Tente de novo em instantes.',
  },
};
export const Vazio: Story = {
  args: { title: 'Cobranças', children: 'Nenhuma cobrança neste período.', size: 'small' },
};
