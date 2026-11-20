import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppSelectComponent } from './app-select.component';

const INPUTS = [
  'value',
  'options',
  'placeholder',
  'label',
  'hint',
  'errorMessage',
  'size',
  'disabled',
  'loading',
  'searchable',
  'multiple',
  'allowClear',
  'emptyText',
];

const OPTIONS = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'ba', label: 'Bahia' },
  { value: 'pr', label: 'Paraná', disabled: true },
];

const meta: Meta<AppSelectComponent> = {
  title: 'Componentes/AppSelect',
  component: AppSelectComponent,
  decorators: [moduleMetadata({ imports: [AppSelectComponent] })],
  args: {
    label: 'Estado',
    placeholder: 'Escolha um estado',
    options: OPTIONS,
    valueChange: fn() as never,
    searched: fn() as never,
  },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
  render: (args) => ({
    props: args,
    template: template('app-select', INPUTS, ['valueChange', 'searched']),
  }),
};
export default meta;
type Story = StoryObj<AppSelectComponent>;

export const Padrao: Story = {
  name: 'Padrão',
  args: { value: 'sp' },
};
export const ComBusca: Story = {
  name: 'Com busca',
  args: { searchable: true, allowClear: true, hint: 'Digite para filtrar a lista.' },
};
export const Multipla: Story = {
  name: 'Múltipla',
  args: { multiple: true, value: ['sp', 'rj'], searchable: true },
};
export const Desabilitado: Story = { args: { value: 'sp', disabled: true } };
export const Carregando: Story = { args: { loading: true, placeholder: 'Carregando estados...' } };
export const Erro: Story = { args: { errorMessage: 'Escolha um estado para continuar.' } };
export const Vazio: Story = {
  args: { options: [], searchable: true, emptyText: 'Nenhum estado cadastrado' },
};
