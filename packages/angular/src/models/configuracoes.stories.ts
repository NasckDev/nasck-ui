import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AppAlertComponent } from '../ui/app-alert.component';
import { AppButtonComponent } from '../ui/app-button.component';
import { AppCardComponent } from '../ui/app-card.component';
import { AppCheckboxComponent } from '../ui/app-checkbox.component';
import { AppFormComponent, AppFormItemComponent } from '../ui/app-form.component';
import { AppInputComponent } from '../ui/app-input.component';
import { AppSelectComponent } from '../ui/app-select.component';
import { AppSwitchComponent } from '../ui/app-switch.component';
import { AppTabsComponent } from '../ui/app-tabs.component';

interface ConfiguracoesArgs {
  erro: boolean;
}

const meta: Meta<ConfiguracoesArgs> = {
  title: 'Modelos/Configurações',
  decorators: [
    moduleMetadata({
      imports: [
        AppAlertComponent,
        AppButtonComponent,
        AppCardComponent,
        AppCheckboxComponent,
        AppFormComponent,
        AppFormItemComponent,
        AppInputComponent,
        AppSelectComponent,
        AppSwitchComponent,
        AppTabsComponent,
      ],
    }),
  ],
  args: { erro: false },
  render: (args) => ({
    props: {
      ...args,
      tabs: [
        { key: 'perfil', label: 'Perfil' },
        { key: 'avisos', label: 'Avisos' },
        { key: 'seguranca', label: 'Segurança' },
      ],
      idiomas: [
        { value: 'pt-BR', label: 'Português (Brasil)' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
      ],
    },
    template: `
      <div style="display:grid;gap:16px;max-width:760px;grid-template-columns:minmax(0,1fr)">
        <h1 style="margin:0">Configurações da conta</h1>
        <app-tabs [items]="tabs" activeKey="perfil" />
        @if (erro) {
          <app-alert type="error" title="Não foi possível salvar" description="Confira os campos destacados e tente de novo." />
        }
        <app-card title="Dados pessoais">
          <app-form>
            <app-input label="Nome completo" value="Marina Albuquerque" [required]="true" />
            <app-input label="E-mail" type="email" value="marina@cliente.com.br" prefixIcon="mail"
              [errorMessage]="erro ? 'Este e-mail já está em uso por outra conta.' : undefined" />
            <app-select label="Idioma" [options]="idiomas" value="pt-BR" />
            <app-form-item label="Preferências" hint="Você pode mudar isso quando quiser.">
              <div style="display:grid;gap:8px">
                <app-switch label="Receber avisos por e-mail" [checked]="true" />
                <app-checkbox label="Mostrar valores em reais" [checked]="true" />
              </div>
            </app-form-item>
            <div style="display:flex;gap:8px">
              <app-button variant="primary" icon="check">Salvar alterações</app-button>
              <app-button>Cancelar</app-button>
            </div>
          </app-form>
        </app-card>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj<ConfiguracoesArgs>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Erro: Story = { args: { erro: true } };
