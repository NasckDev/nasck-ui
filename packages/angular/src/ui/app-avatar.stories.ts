import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppAvatarComponent } from './app-avatar.component';

const INPUTS = ['src', 'name', 'size', 'shape', 'icon'];

const meta: Meta<AppAvatarComponent> = {
  title: 'Componentes/AppAvatar',
  component: AppAvatarComponent,
  decorators: [moduleMetadata({ imports: [AppAvatarComponent] })],
  args: { name: 'Marina Albuquerque' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    icon: { control: 'select', options: [undefined, 'user', 'bell', 'setting'] },
  },
  render: (args) => ({ props: args, template: template('app-avatar', INPUTS) }),
};
export default meta;
type Story = StoryObj<AppAvatarComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Quadrado: Story = { args: { shape: 'square', size: 'large' } };
export const Vazio: Story = { args: { name: undefined, icon: 'user' } };
export const Tamanhos: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="display:flex;gap:12px;align-items:center">
      <app-avatar [name]="name" size="small" />
      <app-avatar [name]="name" size="medium" />
      <app-avatar [name]="name" size="large" />
    </div>`,
  }),
};
