import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import contract from '../../../../contract/contract.json';
import { AppCardComponent } from '../ui/app-card.component';
import { AppTagComponent } from '../ui/app-tag.component';

interface VisaoGeralArgs {
  names: string[];
}

const NAMES = Object.keys(contract.components);

const meta: Meta<VisaoGeralArgs> = {
  title: 'Visão geral/Introdução',
  decorators: [moduleMetadata({ imports: [AppCardComponent, AppTagComponent] })],
  args: { names: NAMES },
  render: (args) => ({
    props: args,
    template: `
      <div style="display:grid;gap:16px;max-width:900px">
        <h1 style="margin:0">Nasck UI</h1>
        <p style="margin:0">
          Wrappers <code>app-*</code> sobre o NG-ZORRO (Angular), com os mesmos nomes e os mesmos
          inputs dos wrappers React sobre o Ant Design. Use a barra de ferramentas para trocar o
          preset de paleta, o modo claro ou escuro e a densidade.
        </p>
        <app-card [title]="names.length + ' componentes no contrato'">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            @for (name of names; track name) {
              <app-tag [label]="name" />
            }
          </div>
        </app-card>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj<VisaoGeralArgs>;

export const Introducao: Story = {
  name: 'Introdução',
};
