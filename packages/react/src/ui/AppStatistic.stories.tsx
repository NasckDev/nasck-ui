import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppStatistic } from './AppStatistic.tsx';

const meta = {
  title: 'Componentes/AppStatistic',
  component: AppStatistic,
  args: { title: 'Receita do mês', value: 66400, prefix: 'R$ ', precision: 2 },
  argTypes: { trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat'] } },
} satisfies Meta<typeof AppStatistic>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { trend: 'up' },
};
export const Queda: Story = {
  args: { title: 'Chamados abertos', value: 88, prefix: '', precision: 0, trend: 'down' },
};
export const Estavel: Story = {
  name: 'Estável',
  args: { title: 'Usuários ativos', value: 1284, prefix: '', precision: 0, trend: 'flat' },
};
export const Carregando: Story = { args: { loading: true } };
export const Vazio: Story = { args: { title: 'Receita do mês', value: 0, trend: undefined } };
export const Erro: Story = {
  args: { title: 'Inadimplência', value: '—', prefix: '', suffix: 'dados indisponíveis' },
};
