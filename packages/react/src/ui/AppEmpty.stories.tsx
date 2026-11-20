import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppEmpty } from './AppEmpty.tsx';

const meta = {
  title: 'Componentes/AppEmpty',
  component: AppEmpty,
  args: {
    title: 'Nenhum cliente cadastrado',
    description: 'Cadastre o primeiro cliente para acompanhar cobranças e atendimentos.',
    actionLabel: 'Cadastrar cliente',
    onAction: fn(),
  },
  argTypes: { image: { control: 'inline-radio', options: ['default', 'simple'] } },
} satisfies Meta<typeof AppEmpty>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Simples: Story = { args: { image: 'simple', actionLabel: undefined } };
export const Erro: Story = {
  args: {
    title: 'Não foi possível carregar',
    description: 'Verifique a conexão e tente de novo.',
    actionLabel: 'Tentar de novo',
  },
};
