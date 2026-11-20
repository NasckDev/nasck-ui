import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppCardComponent } from './app-card.component';

const INPUTS = ['title', 'extra', 'loading', 'bordered', 'hoverable', 'size'];

const meta: Meta<AppCardComponent & { body: string }> = {
  title: 'Componentes/AppCard',
  component: AppCardComponent,
  decorators: [moduleMetadata({ imports: [AppCardComponent] })],
  args: {
    title: 'Resumo da conta',
    extra: 'Atualizado hoje',
    body: 'Plano Profissional com 18 usuários ativos. Próxima cobrança em 05/12.',
  },
  argTypes: { size: { control: 'inline-radio', options: ['default', 'small'] } },
  render: (args) => ({ props: args, template: template('app-card', INPUTS, [], '{{ body }}') }),
};
export default meta;
type Story = StoryObj<AppCardComponent & { body: string }>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { hoverable: true, bordered: false } };
export const Carregando: Story = { args: { loading: true } };
export const Erro: Story = {
  args: {
    title: 'Cobranças',
    body: 'Não foi possível carregar as cobranças. Tente de novo em instantes.',
  },
};
export const Vazio: Story = {
  args: { title: 'Cobranças', body: 'Nenhuma cobrança neste período.', size: 'small' },
};
