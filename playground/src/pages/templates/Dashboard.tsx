import { ArrowDownRight, ArrowUpRight, Bell, Download, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Menu,
  Pagination,
  Table,
  Tabs,
  useToast,
  type TableColumn,
} from '../../../../src';
import { LogoMark } from '../../components/Logo';
import '../../styles/templates-dashboard.css';
import {
  INVOICES,
  KPIS,
  MONTHS,
  MONTHS_12,
  NAV,
  PAGE_SIZE,
  TONE,
  TOP_COLLECTORS,
  brl,
  date,
  type Invoice,
} from './dashboardData';
import { RevenueChart } from './RevenueChart';

export function DashboardTemplate() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [range, setRange] = useState('6m');

  const columns = useMemo<TableColumn<Invoice>[]>(
    () => [
      {
        id: 'client',
        header: 'Cliente',
        cell: (row) => row.client,
        sortable: true,
        sortValue: (row) => row.client,
        isRowHeader: true,
      },
      {
        id: 'owner',
        header: 'Responsável',
        cell: (row) => (
          <span className="tpl-person">
            <Avatar name={row.owner} size="sm" />
            {row.owner}
          </span>
        ),
      },
      {
        id: 'amount',
        header: 'Valor',
        cell: (row) => <span className="tpl-num">{brl(row.amount)}</span>,
        sortable: true,
        sortValue: (row) => row.amount,
        align: 'end',
      },
      {
        id: 'due',
        header: 'Vence',
        cell: (row) => date(row.due),
        sortable: true,
        sortValue: (row) => row.due,
      },
      {
        id: 'status',
        header: 'Situação',
        cell: (row) => <Badge tone={TONE[row.status]}>{row.status}</Badge>,
      },
      {
        id: 'actions',
        header: 'Ações',
        cell: (row) => (
          <Menu
            label={`Ações da fatura ${row.id}`}
            iconOnly
            size="sm"
            align="end"
            icon={<span aria-hidden="true">⋯</span>}
            items={[
              {
                id: 'edit',
                label: 'Editar',
                icon: <Pencil size={16} />,
                onSelect: () => toast({ title: `Editando ${row.id}`, tone: 'neutral' }),
              },
              {
                id: 'pdf',
                label: 'Baixar PDF',
                icon: <Download size={16} />,
                onSelect: () =>
                  toast({
                    title: 'PDF gerado',
                    description: `${row.id} foi baixada.`,
                    tone: 'success',
                  }),
              },
              {
                id: 'del',
                label: 'Excluir fatura',
                icon: <Trash2 size={16} />,
                tone: 'danger',
                separatorBefore: true,
                onSelect: () =>
                  toast({ title: 'Fatura excluída', description: row.id, tone: 'warning' }),
              },
            ]}
          />
        ),
      },
    ],
    [toast],
  );

  const pageCount = Math.ceil(INVOICES.length / PAGE_SIZE);
  const rows = INVOICES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="tpl tpl-dash">
      <div className="tpl-dash__rail">
        <div className="tpl-brand">
          <LogoMark size={24} /> <strong>Fluxo</strong>
        </div>
        <nav aria-label="Seções do aplicativo">
          <ul className="tpl-dash__nav">
            {NAV.map(({ label, icon: Icon, current }) => (
              <li key={label}>
                <a
                  href="#/modelos/painel"
                  aria-current={current ? 'page' : undefined}
                  onClick={(event) => event.preventDefault()}
                >
                  <Icon size={16} aria-hidden="true" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tpl-dash__user">
          <Avatar name="Marina Duarte" />
          <span>
            <strong>Marina Duarte</strong>
            <small>Financeiro</small>
          </span>
        </div>
      </div>
      <div className="tpl-dash__main">
        <header className="tpl-dash__top">
          <div>
            <h2 className="tpl-h">Painel financeiro</h2>
            <p className="tpl-sub">Novembro de 2026 · dados fictícios</p>
          </div>
          <div className="tpl-actions">
            <Button
              variant="secondary"
              size="sm"
              startIcon={<Bell size={16} aria-hidden="true" />}
              onClick={() => toast({ title: '2 faturas vencem esta semana', tone: 'warning' })}
            >
              Alertas
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast({
                  title: 'Nova fatura criada',
                  description: 'Rascunho F-2053 salvo.',
                  tone: 'success',
                })
              }
            >
              Nova fatura
            </Button>
          </div>
        </header>

        <ul className="tpl-kpis">
          {KPIS.map(({ label, value, change, trend, good, description, icon: Icon }) => (
            <li key={label}>
              <Card className="tpl-kpi">
                <span className="tpl-kpi__label">
                  <Icon size={14} aria-hidden="true" /> {label}
                </span>
                <span className="tpl-kpi__value">{value}</span>
                <Badge tone={good ? 'success' : 'danger'}>
                  {trend === 'up' ? (
                    <ArrowUpRight size={12} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight size={12} aria-hidden="true" />
                  )}
                  {change}
                  <span className="nui-visually-hidden">, {description}</span>
                </Badge>
              </Card>
            </li>
          ))}
        </ul>

        <div className="tpl-dash__grid">
          <Card title="Receita" headingLevel={3} className="tpl-dash__chart">
            <Tabs
              label="Período do gráfico"
              value={range}
              onValueChange={setRange}
              items={[
                { id: '6m', label: '6 meses', content: <RevenueChart data={MONTHS} /> },
                { id: '12m', label: '12 meses', content: <RevenueChart data={MONTHS_12} /> },
              ]}
            />
          </Card>
          <Card title="Equipe de cobrança" headingLevel={3}>
            <AvatarGroup
              label="Equipe de cobrança"
              people={[
                'Marina Duarte',
                'Caio Fernandes',
                'Beatriz Nogueira',
                'Renan Albuquerque',
                'Sofia Tavares',
                'Otávio Lins',
              ].map((name) => ({ name }))}
              max={4}
            />
            <p className="tpl-sub">6 pessoas · 38 faturas acompanhadas esta semana.</p>
            <ul className="tpl-top" aria-label="Quem mais recuperou">
              {TOP_COLLECTORS.map((person) => (
                <li key={person.name}>
                  <Avatar name={person.name} size="sm" />
                  <span>{person.name}</span>
                  <span className="tpl-num">{brl(person.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Table
          caption="Faturas recentes"
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
        />
        <div className="tpl-pager">
          <span className="tpl-sub" role="status">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, INVOICES.length)} de{' '}
            {INVOICES.length} faturas
          </span>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
