import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { AppButton } from './AppButton.tsx';
import { AppModal, type AppModalProps } from './AppModal.tsx';

const meta = {
  title: 'Componentes/AppModal',
  component: AppModal,
  args: {
    open: true,
    title: 'Cancelar assinatura',
    okText: 'Cancelar assinatura',
    cancelText: 'Manter plano',
    onOk: fn(),
    onCancel: fn(),
    children:
      'Você perde o acesso ao final do ciclo atual, em 05/12. Seus dados ficam guardados por 30 dias.',
  },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
} satisfies Meta<typeof AppModal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { danger: false },
};
export const Perigo: Story = { args: { danger: true } };
export const Carregando: Story = { args: { loading: true } };
export const SemFechar: Story = {
  name: 'Sem fechar',
  args: { closable: false },
};
function InterativoModal(args: AppModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AppButton variant="primary" onClick={() => setOpen(true)}>
        Abrir diálogo
      </AppButton>
      <AppModal {...args} open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} />
    </>
  );
}

export const Interativo: Story = { render: (args) => <InterativoModal {...args} /> };
