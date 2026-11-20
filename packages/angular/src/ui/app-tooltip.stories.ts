import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { template } from '../stories/helpers';
import { AppIconButtonComponent } from './app-icon-button.component';
import { AppTooltipComponent } from './app-tooltip.component';

const INPUTS = ['title', 'placement'];
const BUTTON = '<app-icon-button icon="download" label="Baixar relatório" variant="default" />';

const meta: Meta<AppTooltipComponent> = {
  title: 'Componentes/AppTooltip',
  component: AppTooltipComponent,
  decorators: [moduleMetadata({ imports: [AppTooltipComponent, AppIconButtonComponent] })],
  args: { title: 'Baixar relatório em PDF' },
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  render: (args) => ({
    props: args,
    template: `<div style="padding:64px">${template('app-tooltip', INPUTS, [], BUTTON)}</div>`,
  }),
};
export default meta;
type Story = StoryObj<AppTooltipComponent>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Embaixo: Story = { args: { placement: 'bottom' } };
