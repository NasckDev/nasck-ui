import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppAvatar } from './AppAvatar.tsx';

const meta = {
  title: 'Componentes/AppAvatar',
  component: AppAvatar,
  args: { name: 'Marina Albuquerque' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    icon: { control: 'select', options: [undefined, 'user', 'bell', 'setting'] },
  },
} satisfies Meta<typeof AppAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Quadrado: Story = { args: { shape: 'square', size: 'large' } };
export const Vazio: Story = { args: { name: undefined, icon: 'user' } };
export const Tamanhos: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <AppAvatar {...args} size="small" />
      <AppAvatar {...args} size="medium" />
      <AppAvatar {...args} size="large" />
    </div>
  ),
};
