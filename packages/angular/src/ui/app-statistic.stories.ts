import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppStatisticComponent } from './app-statistic.component';

const INPUTS = ['title', 'value', 'prefix', 'suffix', 'precision', 'loading', 'trend'];

const meta: Meta<AppStatisticComponent> = {
  title: 'Componentes/AppStatistic',
  component: AppStatisticComponent,
  decorators: [moduleMetadata({ imports: [AppStatisticComponent] })],
  args: { title: 'Receita do mês', value: 66400, prefix: 'R$ ', precision: 2 },
  argTypes: { trend: { control: 'inline-radio', options: [undefined, 'up', 'down', 'flat'] } },
  render: (args) => ({ props: args, template: template('app-statistic', INPUTS) }),
};
export default meta;
type Story = StoryObj<AppStatisticComponent>;

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
export const Vazio: Story = { args: { title: 'Receita do mês', value: 0 } };
export const Erro: Story = {
  args: { title: 'Inadimplência', value: '—', prefix: '', suffix: 'dados indisponíveis' },
};
