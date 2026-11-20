import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppEmptyComponent } from './app-empty.component';

const INPUTS = ['title', 'description', 'actionLabel', 'image'];

const meta: Meta<AppEmptyComponent> = {
  title: 'Componentes/AppEmpty',
  component: AppEmptyComponent,
  decorators: [moduleMetadata({ imports: [AppEmptyComponent] })],
  args: {
    title: 'Nenhum cliente cadastrado',
    description: 'Cadastre o primeiro cliente para acompanhar cobranças e atendimentos.',
    actionLabel: 'Cadastrar cliente',
    action: fn() as never,
  },
  argTypes: { image: { control: 'inline-radio', options: ['default', 'simple'] } },
  render: (args) => ({ props: args, template: template('app-empty', INPUTS, ['action']) }),
};
export default meta;
type Story = StoryObj<AppEmptyComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Simples: Story = { args: { image: 'simple', actionLabel: undefined } };
export const Erro: Story = {
  args: {
    title: 'Não foi possível carregar',
    description: 'Verifique a conexão e tente de novo.',
    actionLabel: 'Tentar de novo',
  },
};
