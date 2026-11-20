import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppSkeleton } from './AppSkeleton.tsx';

const meta = {
  title: 'Componentes/AppSkeleton',
  component: AppSkeleton,
  args: { loading: true, rows: 3, title: true, active: true, children: 'Conteúdo carregado.' },
} satisfies Meta<typeof AppSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Carregando: Story = {};
export const ComAvatar: Story = {
  name: 'Com avatar',
  args: { avatar: true },
};
export const Parado: Story = { args: { active: false } };
export const Padrao: Story = {
  name: 'Padrão',
  args: { loading: false },
};
