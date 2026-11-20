import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton.tsx';

const meta = {
  title: 'Componentes/AppButton',
  component: AppButton,
  args: { children: 'Salvar alterações', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    icon: {
      control: 'select',
      options: [undefined, 'plus', 'download', 'delete', 'edit', 'reload'],
    },
    htmlType: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
  },
} satisfies Meta<typeof AppButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { variant: 'primary' },
};
export const Desabilitado: Story = { args: { variant: 'primary', disabled: true } };
export const Carregando: Story = {
  args: { variant: 'primary', loading: true, children: 'Salvando...' },
};
export const Erro: Story = {
  args: { variant: 'primary', danger: true, icon: 'delete', children: 'Excluir conta' },
};
export const Vazio: Story = {
  args: { variant: 'dashed', icon: 'plus', children: 'Adicionar primeiro item' },
};
export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['primary', 'default', 'dashed', 'text', 'link'] as const).map((variant) => (
        <AppButton key={variant} {...args} variant={variant}>
          {variant}
        </AppButton>
      ))}
    </div>
  ),
};
