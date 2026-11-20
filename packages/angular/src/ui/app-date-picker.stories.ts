import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppDatePickerComponent } from './app-date-picker.component';

const INPUTS = [
  'value',
  'label',
  'placeholder',
  'hint',
  'errorMessage',
  'size',
  'disabled',
  'allowClear',
];

const meta: Meta<AppDatePickerComponent> = {
  title: 'Componentes/AppDatePicker',
  component: AppDatePickerComponent,
  decorators: [moduleMetadata({ imports: [AppDatePickerComponent] })],
  args: { label: 'Data de vencimento', valueChange: fn() as never },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
  render: (args) => ({
    props: args,
    template: template('app-date-picker', INPUTS, ['valueChange']),
  }),
};
export default meta;
type Story = StoryObj<AppDatePickerComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { value: '2026-12-15', hint: 'O boleto vence às 23h59 desta data.' },
};
export const Vazio: Story = {};
export const Desabilitado: Story = { args: { value: '2026-12-15', disabled: true } };
export const Erro: Story = { args: { errorMessage: 'Escolha uma data a partir de amanhã.' } };
