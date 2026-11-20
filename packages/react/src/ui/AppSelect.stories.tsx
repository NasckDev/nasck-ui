import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppSelect } from './AppSelect.tsx';

const OPTIONS = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais' },
  { value: 'rs', label: 'Rio Grande do Sul' },
  { value: 'ba', label: 'Bahia' },
  { value: 'pr', label: 'Paraná', disabled: true },
];

const meta = {
  title: 'Componentes/AppSelect',
  component: AppSelect,
  args: {
    label: 'Estado',
    placeholder: 'Escolha um estado',
    options: OPTIONS,
    onChange: fn(),
    onSearch: fn(),
  },
  argTypes: { size: { control: 'inline-radio', options: ['small', 'medium', 'large'] } },
} satisfies Meta<typeof AppSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

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
