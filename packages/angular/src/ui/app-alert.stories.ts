import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppAlertComponent } from './app-alert.component';

const INPUTS = ['type', 'title', 'description', 'closable', 'showIcon', 'banner'];

const meta: Meta<AppAlertComponent> = {
  title: 'Componentes/AppAlert',
  component: AppAlertComponent,
  decorators: [moduleMetadata({ imports: [AppAlertComponent] })],
  args: {
    title: 'Sua fatura vence em 3 dias',
    description: 'Pague até 05/12 para manter o acesso sem interrupção.',
    closed: fn() as never,
  },
  argTypes: { type: { control: 'inline-radio', options: ['success', 'info', 'warning', 'error'] } },
  render: (args) => ({ props: args, template: template('app-alert', INPUTS, ['closed']) }),
};
export default meta;
type Story = StoryObj<AppAlertComponent>;

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
