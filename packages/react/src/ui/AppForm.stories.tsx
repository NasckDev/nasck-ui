import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton.tsx';
import { AppForm, AppFormItem } from './AppForm.tsx';
import { AppInput } from './AppInput.tsx';
import { AppSwitch } from './AppSwitch.tsx';

const meta = {
  title: 'Componentes/AppForm',
  component: AppForm,
  args: { onSubmit: fn() },
  argTypes: {
    layout: { control: 'inline-radio', options: ['vertical', 'horizontal', 'inline'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <AppForm {...args}>
        <AppInput label="Nome do projeto" placeholder="Ex.: Reforma da sede" required />
        <AppFormItem label="Notificações" hint="Você pode mudar isso depois.">
          <AppSwitch label="Avisar a equipe por e-mail" checked />
        </AppFormItem>
        <AppButton variant="primary" htmlType="submit">
          Criar projeto
        </AppButton>
      </AppForm>
    </div>
  ),
} satisfies Meta<typeof AppForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Horizontal: Story = { args: { layout: 'horizontal' } };
export const Erro: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <AppForm {...args}>
        <AppInput
          label="Nome do projeto"
          value=""
          required
          errorMessage="Dê um nome ao projeto para continuar."
        />
        <AppFormItem label="Responsável" errorMessage="Escolha quem vai cuidar deste projeto.">
          <AppSwitch label="Eu mesmo" checked={false} />
        </AppFormItem>
      </AppForm>
    </div>
  ),
};
export const Vazio: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <AppForm {...args}>
        <AppInput label="Nome do projeto" placeholder="Ex.: Reforma da sede" />
      </AppForm>
    </div>
  ),
};
