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
      <div style="display:grid;gap:24px;max-width:900px;grid-template-columns:minmax(0,1fr)">
        <div style="display:grid;gap:14px">
          <span
            style="font:500 13px/1.4 var(--ant-font-family-code);text-transform:uppercase;color:var(--ant-color-text-description)"
          >Biblioteca de referência / Angular</span>
          <h1
            style="margin:0;font-size:clamp(36px,5vw,56px);line-height:1;font-weight:800;letter-spacing:-0.045em"
          >
            A camada de componentes,
            <mark
              style="background:var(--ant-color-primary);color:var(--ant-color-text-light-solid);padding:0 0.12em;-webkit-box-decoration-break:clone;box-decoration-break:clone"
            >uma API só.</mark>
          </h1>
        </div>
        <p style="margin:0;font-size:17px;line-height:1.55;max-width:640px">
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
