import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton.tsx';
import { AppDrawer, type AppDrawerProps } from './AppDrawer.tsx';

const meta = {
  title: 'Componentes/AppDrawer',
  component: AppDrawer,
  args: {
    open: true,
    title: 'Detalhes do cliente',
    onClose: fn(),
    children: 'Padaria Estrela, plano Essencial, 4 usuários. Cliente desde março de 2024.',
  },
  argTypes: { placement: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] } },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
} satisfies Meta<typeof AppDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Esquerda: Story = { args: { placement: 'left', width: 320 } };
function InterativoDrawer(args: AppDrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppButton onClick={() => setOpen(true)}>Ver detalhes</AppButton>
      <AppDrawer {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Interativo: Story = { render: (args) => <InterativoDrawer {...args} /> };
