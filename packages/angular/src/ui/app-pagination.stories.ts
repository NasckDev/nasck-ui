import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';
import { template } from '../stories/helpers';
import { AppPaginationComponent } from './app-pagination.component';

const INPUTS = ['current', 'total', 'pageSize', 'showSizeChanger', 'simple', 'disabled'];

const meta: Meta<AppPaginationComponent> = {
  title: 'Componentes/AppPagination',
  component: AppPaginationComponent,
  decorators: [moduleMetadata({ imports: [AppPaginationComponent] })],
  args: { current: 2, total: 86, pageSize: 10, pageChange: fn() as never },
  render: (args) => ({ props: args, template: template('app-pagination', INPUTS, ['pageChange']) }),
};
export default meta;
type Story = StoryObj<AppPaginationComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const ComTamanhoDePagina: Story = {
  name: 'Com tamanho de página',
  args: { showSizeChanger: true },
};
export const Simples: Story = { args: { simple: true } };
export const Desabilitado: Story = { args: { disabled: true } };
export const Vazio: Story = { args: { total: 0, current: 1 } };
