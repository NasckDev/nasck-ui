import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppSkeletonComponent } from './app-skeleton.component';

const INPUTS = ['loading', 'rows', 'avatar', 'title', 'active'];

const meta: Meta<AppSkeletonComponent> = {
  title: 'Componentes/AppSkeleton',
  component: AppSkeletonComponent,
  decorators: [moduleMetadata({ imports: [AppSkeletonComponent] })],
  args: { loading: true, rows: 3, title: true, active: true },
  render: (args) => ({
    props: args,
    template: template('app-skeleton', INPUTS, [], 'Conteúdo carregado.'),
  }),
};
export default meta;
type Story = StoryObj<AppSkeletonComponent>;

export const Carregando: Story = {};
export const ComAvatar: Story = {
  name: 'Com avatar',
  args: { avatar: true },
};
export const Parado: Story = { args: { active: false } };
export const Padrao: Story = {
  name: 'Padrão',
  args: { loading: false },
};
