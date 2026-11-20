import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppCheckboxComponent } from './app-checkbox.component';

const INPUTS = ['checked', 'label', 'disabled', 'indeterminate', 'errorMessage'];

const meta: Meta<AppCheckboxComponent> = {
  title: 'Componentes/AppCheckbox',
  component: AppCheckboxComponent,
  decorators: [moduleMetadata({ imports: [AppCheckboxComponent] })],
  args: { label: 'Li e aceito os termos de uso', checkedChange: fn() as never },
  render: (args) => ({
    props: args,
    template: template('app-checkbox', INPUTS, ['checkedChange']),
  }),
};
export default meta;
type Story = StoryObj<AppCheckboxComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { checked: true },
};
export const Vazio: Story = { args: { checked: false } };
export const Indeterminado: Story = {
  args: { indeterminate: true, label: 'Selecionar todas as faturas' },
};
export const Desabilitado: Story = { args: { checked: true, disabled: true } };
export const Erro: Story = {
  args: { checked: false, errorMessage: 'Aceite os termos para criar a conta.' },
};
