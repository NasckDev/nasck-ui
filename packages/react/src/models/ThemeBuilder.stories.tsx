import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeBuilder } from './ThemeBuilder.tsx';

const meta = {
  title: 'Tema/Construtor de tema',
  component: ThemeBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Escolha a cor primária, veja os tokens do Ant Design gerados, confira o contraste AA e exporte o tema em TypeScript, CSS (NG-ZORRO) ou JSON.',
      },
    },
  },
} satisfies Meta<typeof ThemeBuilder>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Construtor: Story = {};
