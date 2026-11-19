import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Table, nextSort, sortRows, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const rows: Row[] = [
  { id: '1', name: 'Bruno', amount: 300 },
  { id: '2', name: 'Ana', amount: 1200 },
  { id: '3', name: 'Carla', amount: 50 },
];

const columns: TableColumn<Row>[] = [
  {
    id: 'name',
    header: 'Cliente',
    cell: (row) => row.name,
    sortable: true,
    sortValue: (row) => row.name,
    isRowHeader: true,
  },
  {
    id: 'amount',
    header: 'Valor',
    cell: (row) => `R$ ${row.amount}`,
    sortable: true,
    sortValue: (row) => row.amount,
    align: 'end',
  },
  { id: 'note', header: 'Obs.', cell: () => '—' },
];

const renderTable = (extra: Partial<Parameters<typeof Table<Row>>[0]> = {}) =>
  render(
    <Table
      caption="Clientes"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      {...extra}
    />,
  );

const bodyNames = (): string[] =>
  screen.getAllByRole('rowheader').map((cell) => cell.textContent ?? '');

describe('Table', () => {
  it('exposes table semantics with caption, headers and row headers', () => {
    renderTable();
    expect(screen.getByRole('table', { name: 'Clientes' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(bodyNames()).toEqual(['Bruno', 'Ana', 'Carla']);
  });

  it('sorts with the keyboard: ascending, descending, then back to original', async () => {
    const user = userEvent.setup();
    renderTable();
    const header = screen.getByRole('columnheader', { name: /Cliente/ });
    expect(header).toHaveAttribute('aria-sort', 'none');
    within(header).getByRole('button').focus();

    await user.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(bodyNames()).toEqual(['Ana', 'Bruno', 'Carla']);

    await user.keyboard(' ');
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(bodyNames()).toEqual(['Carla', 'Bruno', 'Ana']);

    await user.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-sort', 'none');
    expect(bodyNames()).toEqual(['Bruno', 'Ana', 'Carla']);
  });

  it('sorts numeric columns numerically and only one column at a time', async () => {
    const user = userEvent.setup();
    renderTable();
    await user.click(
      within(screen.getByRole('columnheader', { name: /Valor/ })).getByRole('button'),
    );
    expect(bodyNames()).toEqual(['Carla', 'Bruno', 'Ana']);
    await user.click(
      within(screen.getByRole('columnheader', { name: /Cliente/ })).getByRole('button'),
    );
    expect(screen.getByRole('columnheader', { name: /Valor/ })).toHaveAttribute(
      'aria-sort',
      'none',
    );
  });

  it('does not render a button for non-sortable columns', () => {
    renderTable();
    expect(
      within(screen.getByRole('columnheader', { name: 'Obs.' })).queryByRole('button'),
    ).toBeNull();
  });

  it('notifies sort changes when controlled', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    renderTable({ sort: null, onSortChange });
    await user.click(
      within(screen.getByRole('columnheader', { name: /Cliente/ })).getByRole('button'),
    );
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'ascending' });
  });

  it('shows the empty message when there are no rows', () => {
    renderTable({ rows: [], emptyMessage: 'Sem clientes.' });
    expect(screen.getByText('Sem clientes.')).toBeInTheDocument();
  });

  it('labels each cell for the responsive card layout', () => {
    renderTable();
    const row = screen.getAllByRole('row')[1] as HTMLElement;
    expect(within(row).getByText('R$ 300')).toHaveAttribute('data-label', 'Valor');
  });

  it('has no axe violations', async () => {
    const { container } = renderTable({
      defaultSort: { columnId: 'name', direction: 'ascending' },
    });
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('sort helpers', () => {
  it('sortRows is stable and does not mutate the input', () => {
    const tied: Row[] = [
      { id: 'a', name: 'X', amount: 1 },
      { id: 'b', name: 'X', amount: 1 },
    ];
    const result = sortRows(tied, columns[0], 'descending');
    expect(result.map((row) => row.id)).toEqual(['a', 'b']);
    expect(result).not.toBe(tied);
  });

  it('sortRows returns a copy when the column has no sortValue', () => {
    expect(sortRows(rows, columns[2], 'ascending')).toEqual(rows);
    expect(sortRows(rows, undefined, 'ascending')).toEqual(rows);
  });

  it('nextSort cycles ascending, descending, none', () => {
    const asc = nextSort(null, 'a');
    expect(asc).toEqual({ columnId: 'a', direction: 'ascending' });
    expect(nextSort(asc, 'a')).toEqual({ columnId: 'a', direction: 'descending' });
    expect(nextSort({ columnId: 'a', direction: 'descending' }, 'a')).toBeNull();
  });
});
