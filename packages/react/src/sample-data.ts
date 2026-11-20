import type { TableColumn, TableRow } from '@nasckdev/nasck-ui-tokens';

/** Dados ficticios usados nas stories e nos testes. */
export const SAMPLE_COLUMNS: TableColumn[] = [
  { key: 'cliente', title: 'Cliente', sortable: true },
  { key: 'plano', title: 'Plano' },
  { key: 'valor', title: 'Valor mensal', sortable: true, format: 'currency' },
  { key: 'usuarios', title: 'Usuários', sortable: true, format: 'number' },
  { key: 'desde', title: 'Cliente desde', format: 'date' },
];

export const SAMPLE_ROWS: TableRow[] = [
  {
    id: 1,
    cliente: 'Padaria Estrela',
    plano: 'Essencial',
    valor: 189.9,
    usuarios: 4,
    desde: '2024-03-12',
  },
  {
    id: 2,
    cliente: 'Clínica Vida Plena',
    plano: 'Profissional',
    valor: 749,
    usuarios: 18,
    desde: '2023-08-02',
  },
  {
    id: 3,
    cliente: 'Transportes Aurora',
    plano: 'Empresarial',
    valor: 2890,
    usuarios: 64,
    desde: '2022-11-21',
  },
  {
    id: 4,
    cliente: 'Studio Nova Forma',
    plano: 'Essencial',
    valor: 189.9,
    usuarios: 3,
    desde: '2025-01-09',
  },
  {
    id: 5,
    cliente: 'Escola Horizonte',
    plano: 'Profissional',
    valor: 749,
    usuarios: 27,
    desde: '2024-06-30',
  },
  {
    id: 6,
    cliente: 'Mercado Bom Preço',
    plano: 'Empresarial',
    valor: 3120,
    usuarios: 71,
    desde: '2021-05-17',
  },
];

export const MONTHS = ['jun', 'jul', 'ago', 'set', 'out', 'nov'];
export const REVENUE = [48200, 51900, 50300, 58700, 61200, 66400];
export const TICKETS = [132, 118, 141, 109, 97, 88];
