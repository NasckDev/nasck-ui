import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppInputComponent } from './app-input.component';

const INPUTS = [
  'value',
  'type',
  'label',
  'placeholder',
  'hint',
  'errorMessage',
  'size',
  'disabled',
  'loading',
  'allowClear',
  'prefixIcon',
  'required',
];

const meta: Meta<AppInputComponent> = {
  title: 'Componentes/AppInput',
  component: AppInputComponent,
  decorators: [moduleMetadata({ imports: [AppInputComponent] })],
  args: { label: 'E-mail', placeholder: 'voce@empresa.com.br', valueChange: fn() as never },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'textarea'],
    },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    prefixIcon: { control: 'select', options: [undefined, 'mail', 'user', 'search'] },
  },
  render: (args) => ({ props: args, template: template('app-input', INPUTS, ['valueChange']) }),
};
export default meta;
type Story = StoryObj<AppInputComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { value: 'marina@cliente.com.br', hint: 'Usamos este e-mail para enviar o recibo.' },
};
export const Vazio: Story = { args: { prefixIcon: 'mail' } };
export const Desabilitado: Story = { args: { value: 'marina@cliente.com.br', disabled: true } };
export const Carregando: Story = {
  args: { value: 'marina@cliente', loading: true, hint: 'Verificando disponibilidade...' },
};
export const Erro: Story = {
  args: {
    value: 'marina@',
    errorMessage: 'Informe um e-mail completo, como nome@empresa.com.br.',
    required: true,
  },
};
export const Senha: Story = {
  args: { type: 'password', label: 'Senha', placeholder: 'Mínimo de 8 caracteres' },
};
export const AreaDeTexto: Story = {
  name: 'Área de texto',
  args: { type: 'textarea', label: 'Observações', placeholder: 'Conte o que aconteceu' },
};
