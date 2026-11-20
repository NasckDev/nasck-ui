import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppDrawerComponent } from './app-drawer.component';

const INPUTS = ['open', 'title', 'placement', 'width', 'closable'];
const TEXT = 'Padaria Estrela, plano Essencial, 4 usuários. Cliente desde março de 2024.';

const meta: Meta<AppDrawerComponent> = {
  title: 'Componentes/AppDrawer',
  component: AppDrawerComponent,
  decorators: [moduleMetadata({ imports: [AppDrawerComponent] })],
  args: { open: true, title: 'Detalhes do cliente', closed: fn() as never },
  argTypes: { placement: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] } },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: (args) => ({ props: args, template: template('app-drawer', INPUTS, ['closed'], TEXT) }),
};
export default meta;
type Story = StoryObj<AppDrawerComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Esquerda: Story = { args: { placement: 'left', width: 320 } };
