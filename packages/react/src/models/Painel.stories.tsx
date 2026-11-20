import type { Meta, StoryObj } from '@storybook/react-vite';
import { FONT_FAMILY_HEADING } from '@nasckdev/nasck-ui-tokens';
import { useState } from 'react';
import { AppAvatar } from '../ui/AppAvatar.tsx';
import { AppButton } from '../ui/AppButton.tsx';
import { AppCard } from '../ui/AppCard.tsx';
import { AppChart } from '../ui/AppChart.tsx';
import { AppInput } from '../ui/AppInput.tsx';
import { AppPagination } from '../ui/AppPagination.tsx';
import { AppStatistic } from '../ui/AppStatistic.tsx';
import { AppStatus } from '../ui/AppTag.tsx';
import { AppTable } from '../ui/AppTable.tsx';
import { MONTHS, REVENUE, SAMPLE_COLUMNS, SAMPLE_ROWS, TICKETS } from '../sample-data.ts';

function Painel({ loading = false }: { loading?: boolean }) {
  const [busca, setBusca] = useState('');
  const rows = SAMPLE_ROWS.filter((row) =>
    String(row['cliente']).toLowerCase().includes(busca.toLowerCase()),
  );
  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontFamily: FONT_FAMILY_HEADING }}>Painel comercial</h1>
          <AppStatus status="success" label="Dados atualizados há 5 minutos" />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <AppAvatar name="Marina Albuquerque" />
          <AppButton variant="primary" icon="plus">
            Novo cliente
          </AppButton>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
        }}
      >
        <div>
          <AppCard loading={loading}>
            <AppStatistic
              title="Receita do mês"
              value={66400}
              prefix="R$ "
              precision={2}
              trend="up"
            />
          </AppCard>
        </div>
        <div>
          <AppCard loading={loading}>
            <AppStatistic title="Clientes ativos" value={341} trend="up" />
          </AppCard>
        </div>
        <div>
          <AppCard loading={loading}>
            <AppStatistic title="Chamados abertos" value={88} trend="down" />
          </AppCard>
        </div>
        <div>
          <AppCard loading={loading}>
            <AppStatistic title="Inadimplência" value={2.4} suffix="%" precision={1} trend="flat" />
          </AppCard>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
        }}
      >
        <div>
          <AppCard title="Receita mensal">
            <AppChart
              type="area"
              categories={MONTHS}
              series={[{ name: 'Receita', data: REVENUE }]}
              valueFormat="currency"
              loading={loading}
              ariaLabel="Receita mensal de junho a novembro, crescendo de 48 mil para 66 mil reais"
              height={200}
            />
          </AppCard>
        </div>
        <div>
          <AppCard title="Chamados por mês">
            <AppChart
              type="bar"
              categories={MONTHS}
              series={[{ name: 'Chamados', data: TICKETS }]}
              loading={loading}
              ariaLabel="Chamados por mês, em queda de 132 para 88"
              height={200}
            />
          </AppCard>
        </div>
      </div>
      <AppCard title="Clientes" extra={`${rows.length} resultados`}>
        <div style={{ maxWidth: 320, marginBottom: 12 }}>
          <AppInput
            label="Buscar cliente"
            type="search"
            placeholder="Nome do cliente"
            value={busca}
            onChange={setBusca}
            allowClear
          />
        </div>
        <AppTable
          columns={SAMPLE_COLUMNS}
          data={rows}
          loading={loading}
          pageSize={4}
          emptyText="Nenhum cliente com esse nome."
        />
        <div style={{ marginTop: 12 }}>
          <AppPagination total={86} current={1} simple />
        </div>
      </AppCard>
    </div>
  );
}

const meta = {
  title: 'Modelos/Painel',
  component: Painel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Painel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Carregando: Story = { args: { loading: true } };
