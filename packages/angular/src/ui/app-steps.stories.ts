import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppStepsComponent } from './app-steps.component';

const INPUTS = ['items', 'current', 'direction', 'size'];

const ITEMS = [
  { title: 'Dados da empresa', description: 'CNPJ e endereço' },
  { title: 'Plano', description: 'Escolha o plano ideal' },
  { title: 'Pagamento', description: 'Cartão ou boleto' },
  { title: 'Pronto', description: 'Acesso liberado' },
];

const meta: Meta<AppStepsComponent> = {
  title: 'Componentes/AppSteps',
  component: AppStepsComponent,
  decorators: [moduleMetadata({ imports: [AppStepsComponent] })],
  args: { items: ITEMS, current: 1 },
  argTypes: {
    direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    current: { control: { type: 'number', min: 0, max: 3 } },
  },
  render: (args) => ({ props: args, template: template('app-steps', INPUTS) }),
};
export default meta;
type Story = StoryObj<AppStepsComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Vertical: Story = { args: { direction: 'vertical' } };
export const Erro: Story = {
  args: {
    current: 2,
    items: [
      ITEMS[0] ?? { title: '' },
      ITEMS[1] ?? { title: '' },
      { title: 'Pagamento', description: 'Cartão recusado. Use outro cartão.', status: 'error' },
      ITEMS[3] ?? { title: '' },
    ],
  },
};
export const Vazio: Story = { args: { current: 0 } };
