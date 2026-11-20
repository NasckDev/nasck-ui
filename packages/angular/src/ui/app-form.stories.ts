import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { AppButtonComponent } from './app-button.component';
import { AppFormComponent, AppFormItemComponent } from './app-form.component';
import { AppInputComponent } from './app-input.component';
import { AppSwitchComponent } from './app-switch.component';

const IMPORTS = [
  AppFormComponent,
  AppFormItemComponent,
  AppInputComponent,
  AppSwitchComponent,
  AppButtonComponent,
];

const meta: Meta<AppFormComponent> = {
  title: 'Componentes/AppForm',
  component: AppFormComponent,
  decorators: [moduleMetadata({ imports: IMPORTS })],
  args: { submitted: fn() as never },
  argTypes: {
    layout: { control: 'inline-radio', options: ['vertical', 'horizontal', 'inline'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:420px">
      <app-form [layout]="layout" [disabled]="disabled" [size]="size" (submitted)="submitted($event)">
        <app-input label="Nome do projeto" placeholder="Ex.: Reforma da sede" [required]="true" />
        <app-form-item label="Notificações" hint="Você pode mudar isso depois.">
          <app-switch label="Avisar a equipe por e-mail" [checked]="true" />
        </app-form-item>
        <app-button variant="primary" htmlType="submit">Criar projeto</app-button>
      </app-form>
    </div>`,
  }),
};
export default meta;
type Story = StoryObj<AppFormComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Desabilitado: Story = { args: { disabled: true } };
export const Horizontal: Story = { args: { layout: 'horizontal' } };
export const Erro: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="max-width:420px">
      <app-form [layout]="layout">
        <app-input label="Nome do projeto" value="" [required]="true"
          errorMessage="Dê um nome ao projeto para continuar." />
        <app-form-item label="Responsável" errorMessage="Escolha quem vai cuidar deste projeto.">
          <app-switch label="Eu mesmo" [checked]="false" />
        </app-form-item>
      </app-form>
    </div>`,
  }),
};
export const Vazio: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="max-width:420px">
      <app-form [layout]="layout">
        <app-input label="Nome do projeto" placeholder="Ex.: Reforma da sede" />
      </app-form>
    </div>`,
  }),
};
