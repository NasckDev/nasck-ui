import { Badge, Table, type TableColumn } from '../../../../src';
import { type ComponentDoc, type Control } from '../types';
import { attr, bool, str } from '../shared';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

const INVOICES: Invoice[] = [
  { id: 'F-1042', client: 'Lumen Estúdio', amount: 4820.5, status: 'Pago' },
  { id: 'F-1043', client: 'Cooperativa Alvorada', amount: 12900, status: 'Pendente' },
  { id: 'F-1044', client: 'Mercado Beira-Rio', amount: 780.9, status: 'Atrasado' },
  { id: 'F-1045', client: 'Clínica Vértice', amount: 3150, status: 'Pago' },
  { id: 'F-1046', client: 'Oficina do Tato', amount: 1290.75, status: 'Pendente' },
];

const brl = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_TONE = { Pago: 'success', Pendente: 'warning', Atrasado: 'danger' } as const;

const invoiceColumns: TableColumn<Invoice>[] = [
  {
    id: 'client',
    header: 'Cliente',
    cell: (row) => row.client,
    sortable: true,
    sortValue: (row) => row.client,
    isRowHeader: true,
  },
  {
    id: 'id',
    header: 'Fatura',
    cell: (row) => <code>{row.id}</code>,
    sortable: true,
    sortValue: (row) => row.id,
  },
  {
    id: 'amount',
    header: 'Valor',
    cell: (row) => brl(row.amount),
    sortable: true,
    sortValue: (row) => row.amount,
    align: 'end',
  },
  {
    id: 'status',
    header: 'Situação',
    cell: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
];

const tableControls: Control[] = [
  { name: 'caption', kind: 'text', default: 'Faturas do mês' },
  { name: 'hideCaption', kind: 'boolean', default: false },
  { name: 'rows', kind: 'select', options: ['5', '3', '0'], default: '5' },
  { name: 'emptyMessage', kind: 'text', default: 'Nenhuma fatura neste período.' },
  {
    name: 'defaultSort',
    kind: 'select',
    options: ['sem ordem', 'valor, maior primeiro'],
    default: 'valor, maior primeiro',
  },
];

const tableSetup = [
  'interface Invoice {',
  '  id: string;',
  '  client: string;',
  '  amount: number;',
  "  status: 'Pago' | 'Pendente' | 'Atrasado';",
  '}',
  '',
  'const invoices: Invoice[] = [',
  "  { id: 'F-1042', client: 'Lumen Estúdio', amount: 4820.5, status: 'Pago' },",
  "  { id: 'F-1043', client: 'Cooperativa Alvorada', amount: 12900, status: 'Pendente' },",
  "  { id: 'F-1044', client: 'Mercado Beira-Rio', amount: 780.9, status: 'Atrasado' },",
  "  { id: 'F-1045', client: 'Clínica Vértice', amount: 3150, status: 'Pago' },",
  "  { id: 'F-1046', client: 'Oficina do Tato', amount: 1290.75, status: 'Pendente' },",
  '];',
  '',
  'const brl = (value: number) =>',
  "  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });",
  '',
  'const columns: TableColumn<Invoice>[] = [',
  '  {',
  "    id: 'client',",
  "    header: 'Cliente',",
  '    cell: (row) => row.client,',
  '    sortable: true,',
  '    sortValue: (row) => row.client,',
  '    isRowHeader: true,',
  '  },',
  '  {',
  "    id: 'amount',",
  "    header: 'Valor',",
  '    cell: (row) => brl(row.amount),',
  '    sortable: true,',
  '    sortValue: (row) => row.amount,',
  "    align: 'end',",
  '  },',
  '  {',
  "    id: 'status',",
  "    header: 'Situação',",
  '    cell: (row) => <Badge>{row.status}</Badge>,',
  '  },',
  '];',
].join('\n');

export const doc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  group: 'Dados',
  summary:
    'Tabela ordenável e responsiva: no celular cada linha vira um cartão com rótulo e valor.',
  semantics:
    '<table> real com <caption>, aria-sort e botão de ordenação em cada cabeçalho; papéis ARIA explícitos mantêm a semântica no layout de cartões.',
  keyboard: [
    { keys: 'Tab', action: 'Move entre os botões de ordenação e controles dentro das células.' },
    { keys: 'Enter / Espaço', action: 'Ordena pela coluna: crescente, decrescente, sem ordem.' },
  ],
  aria: [
    'caption dá o nome da tabela; use hideCaption para ocultá-lo só visualmente.',
    'aria-sort aparece apenas em colunas ordenáveis (none, ascending, descending).',
    'O estado de ordenação é anunciado dentro do botão ("ordem crescente").',
    'A coluna com isRowHeader vira <th scope="row">, o que ajuda a ler cada linha.',
    'Em telas estreitas (container query), os rótulos vêm de data-label e o thead fica oculto só visualmente.',
  ],
  props: [
    { name: 'caption', type: 'string', description: 'Nome da tabela (obrigatório).' },
    {
      name: 'columns',
      type: 'TableColumn<Row>[]',
      description: 'id, header, cell, sortable, sortValue, align e isRowHeader.',
    },
    {
      name: 'rows / getRowId',
      type: 'Row[] / (row) => string',
      description: 'Dados e chave estável de cada linha.',
    },
    {
      name: 'sort / defaultSort / onSortChange',
      type: 'SortState | null',
      description: 'Ordenação controlada ou não.',
    },
    { name: 'emptyMessage', type: 'ReactNode', description: 'Conteúdo quando não há linhas.' },
  ],
  demos: [
    {
      title: 'Ordenável',
      note: 'Clique no cabeçalho ou use Enter/Espaço. Reduza a janela para ver os cartões.',
      preview: (
        <Table
          caption="Faturas do mês"
          columns={invoiceColumns}
          rows={INVOICES}
          getRowId={(row) => row.id}
          defaultSort={{ columnId: 'amount', direction: 'descending' }}
        />
      ),
      code: `<Table
  caption="Faturas do mês"
  columns={columns}
  rows={invoices}
  getRowId={(row) => row.id}
  defaultSort={{ columnId: 'amount', direction: 'descending' }}
/>`,
      setup: tableSetup,
    },
    {
      title: 'Vazia',
      preview: (
        <Table
          caption="Faturas"
          columns={invoiceColumns}
          rows={[]}
          getRowId={(row) => row.id}
          emptyMessage="Nenhuma fatura neste período."
        />
      ),
      code: `<Table
  caption="Faturas"
  columns={columns}
  rows={[]}
  getRowId={(row) => row.id}
  emptyMessage="Nenhuma fatura neste período."
/>`,
      setup: tableSetup,
    },
  ],
  anatomy: [
    {
      label: 'Legenda',
      description: 'Nome da tabela, lido por leitores de tela.',
      selector: '.nui-table__caption',
    },
    {
      label: 'Cabeçalho',
      description: 'Células com aria-sort e botão de ordenação.',
      selector: '.nui-table__th',
    },
    { label: 'Linha', description: 'Vira cartão abaixo de 40rem.', selector: '.nui-table__row' },
    {
      label: 'Cabeçalho de linha',
      description: 'A coluna que nomeia a linha.',
      selector: '.nui-table__td--head',
    },
  ],
  dos: [
    {
      text: 'Dê uma legenda curta que diga o que a tabela mostra.',
      code: 'caption="Faturas do mês"',
    },
    {
      text: 'Marque a coluna que identifica a linha com isRowHeader.',
      code: 'isRowHeader: true',
    },
    { text: 'Alinhe números ao final e formate em pt-BR.', code: "align: 'end'" },
  ],
  donts: [
    { text: 'Não use Table para organizar layout de página.' },
    { text: 'Não deixe colunas ordenáveis sem sortValue: o botão não faria nada.' },
    { text: 'Não esconda informação essencial só em tooltips dentro das células.' },
  ],

  playground: {
    controls: tableControls,
    render: (v) => (
      <Table
        key={String(v.defaultSort)}
        caption={str(v, 'caption') || 'Tabela'}
        hideCaption={bool(v, 'hideCaption')}
        columns={invoiceColumns}
        rows={INVOICES.slice(0, Number(v.rows))}
        getRowId={(row) => row.id}
        emptyMessage={str(v, 'emptyMessage') || undefined}
        defaultSort={
          v.defaultSort === 'sem ordem' ? null : { columnId: 'amount', direction: 'descending' }
        }
      />
    ),
    setup: () => tableSetup,
    code: (v) =>
      [
        '<Table',
        '  ' + attr('caption', str(v, 'caption')),
        bool(v, 'hideCaption') ? '  hideCaption' : '',
        '  columns={columns}',
        '  rows={invoices' + (v.rows === '5' ? '' : '.slice(0, ' + String(v.rows) + ')') + '}',
        '  getRowId={(row) => row.id}',
        str(v, 'emptyMessage') && v.rows === '0'
          ? '  ' + attr('emptyMessage', str(v, 'emptyMessage'))
          : '',
        v.defaultSort === 'sem ordem'
          ? ''
          : "  defaultSort={{ columnId: 'amount', direction: 'descending' }}",
        '/>',
      ]
        .filter((line) => line !== '')
        .join('\n'),
  },
};
