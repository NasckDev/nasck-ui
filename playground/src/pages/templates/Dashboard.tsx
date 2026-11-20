import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CircleDollarSign,
  Download,
  FileText,
  LayoutDashboard,
  Pencil,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
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
  type BadgeTone,
  type TableColumn,
} from '../../../../src';
import { LogoMark } from '../../components/Logo';

interface Invoice {
  id: string;
  client: string;
  owner: string;
  amount: number;
  due: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

const INVOICES: Invoice[] = [
  {
    id: 'F-2041',
    client: 'Lumen Estúdio',
    owner: 'Marina Duarte',
    amount: 4820.5,
    due: '2026-11-28',
    status: 'Pago',
  },
  {
    id: 'F-2042',
    client: 'Cooperativa Alvorada',
    owner: 'Caio Fernandes',
    amount: 12900,
    due: '2026-12-02',
    status: 'Pendente',
  },
  {
    id: 'F-2043',
    client: 'Mercado Beira-Rio',
    owner: 'Beatriz Nogueira',
    amount: 780.9,
    due: '2026-11-10',
    status: 'Atrasado',
  },
  {
    id: 'F-2044',
    client: 'Clínica Vértice',
    owner: 'Marina Duarte',
    amount: 3150,
    due: '2026-12-05',
    status: 'Pago',
  },
  {
    id: 'F-2045',
    client: 'Oficina do Tato',
    owner: 'Renan Albuquerque',
    amount: 1290.75,
    due: '2026-12-09',
    status: 'Pendente',
  },
  {
    id: 'F-2046',
    client: 'Escola Girassol',
    owner: 'Sofia Tavares',
    amount: 8640,
    due: '2026-11-15',
    status: 'Atrasado',
  },
  {
    id: 'F-2047',
    client: 'Padaria Estrela',
    owner: 'Caio Fernandes',
    amount: 420,
    due: '2026-12-12',
    status: 'Pago',
  },
  {
    id: 'F-2048',
    client: 'Instituto Horizonte',
    owner: 'Beatriz Nogueira',
    amount: 15700,
    due: '2026-12-18',
    status: 'Pendente',
  },
  {
    id: 'F-2049',
    client: 'Grupo Vale Verde',
    owner: 'Otávio Lins',
    amount: 22300,
    due: '2026-12-20',
    status: 'Pago',
  },
  {
    id: 'F-2050',
    client: 'Ótica Panorama',
    owner: 'Renan Albuquerque',
    amount: 2260,
    due: '2026-12-22',
    status: 'Pendente',
  },
  {
    id: 'F-2051',
    client: 'Transportes Aurora',
    owner: 'Marina Duarte',
    amount: 9980,
    due: '2026-12-27',
    status: 'Pago',
  },
  {
    id: 'F-2052',
    client: 'Livraria Marginal',
    owner: 'Sofia Tavares',
    amount: 1180.4,
    due: '2027-01-03',
    status: 'Pendente',
  },
];

const PAGE_SIZE = 5;
const TONE: Record<Invoice['status'], BadgeTone> = {
  Pago: 'success',
  Pendente: 'warning',
  Atrasado: 'danger',
};
const brl = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (iso: string): string =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const TOP_COLLECTORS = [
  { name: 'Marina Duarte', amount: 21400 },
  { name: 'Caio Fernandes', amount: 15800 },
  { name: 'Sofia Tavares', amount: 9200 },
];

const MONTHS = [
  { label: 'jun', value: 48 },
  { label: 'jul', value: 56 },
  { label: 'ago', value: 52 },
  { label: 'set', value: 67 },
  { label: 'out', value: 72 },
  { label: 'nov', value: 81 },
];

const MONTHS_12 = [
  { label: 'dez', value: 38 },
  { label: 'jan', value: 41 },
  { label: 'fev', value: 39 },
  { label: 'mar', value: 45 },
  { label: 'abr', value: 44 },
  { label: 'mai', value: 50 },
  ...MONTHS,
];

const KPIS = [
  {
    label: 'Receita do mês',
    value: 'R$ 81,2 mil',
    delta: '+12,4%',
    up: true,
    icon: CircleDollarSign,
  },
  { label: 'Faturas em aberto', value: '14', delta: '-3', up: true, icon: FileText },
  { label: 'Clientes ativos', value: '212', delta: '+9', up: true, icon: Users },
  { label: 'Inadimplência', value: '3,8%', delta: '+0,6 p.p.', up: false, icon: BarChart3 },
];

const NAV = [
  { label: 'Painel', icon: LayoutDashboard, current: true },
  { label: 'Faturas', icon: FileText },
  { label: 'Clientes', icon: Users },
  { label: 'Configurações', icon: Settings },
];

function RevenueChart({ data }: { data: typeof MONTHS }) {
  const max = Math.max(...data.map((month) => month.value));
  const step = 288 / data.length;
  const barWidth = Math.min(30, step * 0.62);
  return (
    <figure className="tpl-chart">
      <figcaption className="tpl-chart__caption">Receita por mês (R$ mil)</figcaption>
      <svg
        viewBox="0 0 300 140"
        className="tpl-chart__svg"
        role="img"
        aria-label={`Gráfico de barras da receita: ${data.map((m) => `${m.label} ${m.value} mil`).join(', ')}.`}
      >
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2="300"
            y1={20 + line * 30}
            y2={20 + line * 30}
            className="tpl-chart__grid"
          />
        ))}
        {data.map((month, index) => {
          const height = (month.value / max) * 100;
          const last = index === data.length - 1;
          const x = 6 + index * step + (step - barWidth) / 2;
          return (
            <g key={month.label}>
              <rect
                x={x}
                y={120 - height}
                width={barWidth}
                height={height}
                rx="2"
                className={last ? 'tpl-chart__bar tpl-chart__bar--now' : 'tpl-chart__bar'}
                style={{ animationDelay: `${index * 60}ms` }}
              />
              <text x={x + barWidth / 2} y="136" textAnchor="middle" className="tpl-chart__label">
                {month.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

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
        <div className="tpl-dash__brand">
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
          {KPIS.map(({ label, value, delta, up, icon: Icon }) => (
            <li key={label}>
              <Card className="tpl-kpi">
                <span className="tpl-kpi__label">
                  <Icon size={14} aria-hidden="true" /> {label}
                </span>
                <span className="tpl-kpi__value">{value}</span>
                <Badge tone={up ? 'success' : 'danger'}>
                  {up ? (
                    <ArrowUpRight size={12} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight size={12} aria-hidden="true" />
                  )}
                  {delta}
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
