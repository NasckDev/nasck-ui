import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppModalComponent } from './app-modal.component';

const INPUTS = ['open', 'title', 'okText', 'cancelText', 'loading', 'danger', 'width', 'closable'];
const TEXT =
  'Você perde o acesso ao final do ciclo atual, em 05/12. Seus dados ficam guardados por 30 dias.';

const meta: Meta<AppModalComponent> = {
  title: 'Componentes/AppModal',
  component: AppModalComponent,
  decorators: [moduleMetadata({ imports: [AppModalComponent] })],
  args: {
    open: true,
    title: 'Cancelar assinatura',
    okText: 'Cancelar assinatura',
    cancelText: 'Manter plano',
    confirmed: fn() as never,
    cancelled: fn() as never,
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: (args) => ({
    props: args,
    template: template('app-modal', INPUTS, ['confirmed', 'cancelled'], TEXT),
  }),
};
export default meta;
type Story = StoryObj<AppModalComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { danger: false },
};
export const Perigo: Story = { args: { danger: true } };
export const Carregando: Story = { args: { loading: true } };
export const SemFechar: Story = {
  name: 'Sem fechar',
  args: { closable: false },
};
