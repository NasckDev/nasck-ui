import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppCard } from '../ui/AppCard.tsx';
import { AppTag } from '../ui/AppTag.tsx';
import contract from '../../../../contract/contract.json';

function VisaoGeral() {
  const names = Object.keys(contract.components);
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 900 }}>
      <h1 style={{ margin: 0 }}>Nasck UI</h1>
      <p style={{ margin: 0 }}>
        Wrappers <code>App*</code> sobre o Ant Design (React) e o NG-ZORRO (Angular), com os mesmos
        nomes e as mesmas props nos dois frameworks. Use a barra de ferramentas para trocar o preset
        de paleta, o modo claro ou escuro e a densidade.
      </p>
      <AppCard title={`${names.length} componentes no contrato`}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {names.map((name) => (
            <AppTag key={name} label={name} />
          ))}
        </div>
      </AppCard>
    </div>
  );
}

const meta = {
  title: 'Visão geral/Introdução',
  component: VisaoGeral,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof VisaoGeral>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Introducao: Story = {
  name: 'Introdução',
};
