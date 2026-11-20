import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppIconButton } from './AppIconButton.tsx';
import { AppTooltip } from './AppTooltip.tsx';

const meta = {
  title: 'Componentes/AppTooltip',
  component: AppTooltip,
  args: {
    title: 'Baixar relatório em PDF',
    children: <AppIconButton icon="download" label="Baixar relatório" variant="default" />,
  },
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  decorators: [
    (Story) => (
      <div style={{ padding: 64 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Embaixo: Story = { args: { placement: 'bottom' } };
