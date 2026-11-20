import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppSwitchComponent } from './app-switch.component';

const INPUTS = ['checked', 'label', 'disabled', 'loading', 'size'];

const meta: Meta<AppSwitchComponent> = {
  title: 'Componentes/AppSwitch',
  component: AppSwitchComponent,
  decorators: [moduleMetadata({ imports: [AppSwitchComponent] })],
  args: { label: 'Receber avisos por e-mail', checkedChange: fn() as never },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium'] } },
  render: (args) => ({ props: args, template: template('app-switch', INPUTS, ['checkedChange']) }),
};
export default meta;
type Story = StoryObj<AppSwitchComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { checked: true },
};
export const Vazio: Story = { args: { checked: false } };
export const Desabilitado: Story = { args: { checked: true, disabled: true } };
export const Carregando: Story = {
  args: { checked: true, loading: true, label: 'Salvando preferência...' },
};
