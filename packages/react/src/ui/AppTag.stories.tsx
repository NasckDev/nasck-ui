import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppStatus, AppTag } from './AppTag.tsx';

const meta = {
  title: 'Componentes/AppTag',
  component: AppTag,
  args: { label: 'Em análise', color: 'info', onClose: fn() },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info', 'processing'],
    },
    icon: { control: 'select', options: [undefined, 'check', 'warning', 'info', 'bell'] },
  },
} satisfies Meta<typeof AppTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Fechavel: Story = {
  name: 'Fechável',
  args: { closable: true, label: 'Filtro: pendentes' },
};
export const ComIcone: Story = {
  name: 'Com ícone',
  args: { color: 'success', icon: 'check', label: 'Pago' },
};
export const Erro: Story = { args: { color: 'error', icon: 'warning', label: 'Vencido' } };
export const SemBorda: Story = {
  name: 'Sem borda',
  args: { bordered: false, color: 'warning', label: 'Pendente' },
};

export const Status: StoryObj<typeof AppStatus> = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <AppStatus status="success" label="Aprovado" />
      <AppStatus status="warning" label="Pendente" />
      <AppStatus status="error" label="Rejeitado" />
      <AppStatus status="info" label="Em análise" />
      <AppStatus status="processing" label="Processando" />
      <AppStatus status="default" label="Rascunho" />
    </div>
  ),
};
