import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppAlert } from './AppAlert.tsx';

const meta = {
  title: 'Componentes/AppAlert',
  component: AppAlert,
  args: {
    title: 'Sua fatura vence em 3 dias',
    description: 'Pague até 05/12 para manter o acesso sem interrupção.',
    onClose: fn(),
  },
  argTypes: { type: { control: 'inline-radio', options: ['success', 'info', 'warning', 'error'] } },
} satisfies Meta<typeof AppAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { type: 'info' },
};
export const Sucesso: Story = {
  args: { type: 'success', title: 'Pagamento confirmado', description: undefined },
};
export const Aviso: Story = { args: { type: 'warning', closable: true } };
export const Erro: Story = {
  args: {
    type: 'error',
    title: 'Não conseguimos cobrar o cartão',
    description: 'Atualize os dados do cartão ou escolha pagar com boleto.',
  },
};
export const Faixa: Story = {
  args: { type: 'warning', banner: true, title: 'Manutenção programada hoje às 22h' },
};
export const SemIcone: Story = {
  name: 'Sem ícone',
  args: { showIcon: false },
};
