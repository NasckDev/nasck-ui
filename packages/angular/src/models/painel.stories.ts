import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { MONTHS, REVENUE, SAMPLE_COLUMNS, SAMPLE_ROWS, TICKETS } from '../sample-data';
import { AppAvatarComponent } from '../ui/app-avatar.component';
import { AppButtonComponent } from '../ui/app-button.component';
import { AppCardComponent } from '../ui/app-card.component';
import { AppChartComponent } from '../ui/app-chart.component';
import { AppStatisticComponent } from '../ui/app-statistic.component';
import { AppStatusComponent } from '../ui/app-tag.component';
import { AppTableComponent } from '../ui/app-table.component';

interface PainelArgs {
  loading: boolean;
}

const meta: Meta<PainelArgs> = {
  title: 'Modelos/Painel',
  decorators: [
    moduleMetadata({
      imports: [
        AppAvatarComponent,
        AppButtonComponent,
        AppCardComponent,
        AppChartComponent,
        AppStatisticComponent,
        AppStatusComponent,
        AppTableComponent,
      ],
    }),
  ],
  args: { loading: false },
  render: (args) => ({
    props: {
      ...args,
      columns: SAMPLE_COLUMNS,
      rows: SAMPLE_ROWS,
      months: MONTHS,
      revenue: [{ name: 'Receita', data: REVENUE }],
      tickets: [{ name: 'Chamados', data: TICKETS }],
    },
    styles: [
      `.kpis { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); }
       .charts { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); }
       .head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
       h1 { margin: 0; }
       .stack { display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); }`,
    ],
    template: `
      <div class="stack">
        <div class="head">
          <div>
            <h1>Painel comercial</h1>
            <app-status status="success" label="Dados atualizados há 5 minutos" />
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <app-avatar name="Marina Albuquerque" />
            <app-button variant="primary" icon="plus">Novo cliente</app-button>
          </div>
        </div>
        <div class="kpis">
          <app-card><app-statistic title="Receita do mês" [value]="66400" prefix="R$ " [precision]="2" trend="up" [loading]="loading" /></app-card>
          <app-card><app-statistic title="Clientes ativos" [value]="341" trend="up" [loading]="loading" /></app-card>
          <app-card><app-statistic title="Chamados abertos" [value]="88" trend="down" [loading]="loading" /></app-card>
          <app-card><app-statistic title="Inadimplência" [value]="2.4" suffix="%" [precision]="1" trend="flat" [loading]="loading" /></app-card>
        </div>
        <div class="charts">
          <app-card title="Receita mensal">
            <app-chart type="area" [categories]="months" [series]="revenue" valueFormat="currency" [loading]="loading"
              ariaLabel="Receita mensal de junho a novembro, crescendo de 48 mil para 66 mil reais" [height]="260" />
          </app-card>
          <app-card title="Chamados por mês">
            <app-chart type="bar" [categories]="months" [series]="tickets" [loading]="loading"
              ariaLabel="Chamados por mês, em queda de 132 para 88" [height]="260" />
          </app-card>
        </div>
        <app-card title="Clientes" extra="6 resultados">
          <app-table [columns]="columns" [data]="rows" [loading]="loading" [pageSize]="4" />
        </app-card>
      </div>`,
  }),
};
export default meta;
type Story = StoryObj<PainelArgs>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Carregando: Story = { args: { loading: true } };
