/* eslint-disable jsx-a11y/no-redundant-roles, jsx-a11y/no-interactive-element-to-noninteractive-role --
   explicit roles keep table semantics when CSS switches the elements to display:block (card layout). */
import { useMemo, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Table.css';

export type SortDirection = 'ascending' | 'descending';

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

export interface TableColumn<Row> {
  id: string;
  header: string;
  /** Cell content. Defaults to nothing: always provide it. */
  cell: (row: Row) => ReactNode;
  /** Makes the header a sort button. Provide `sortValue` to define the ordering. */
  sortable?: boolean;
  sortValue?: (row: Row) => string | number;
  /** Aligns numeric columns to the end. */
  align?: 'start' | 'end';
  /** Marks the column that names the row; its cells become row headers. */
  isRowHeader?: boolean;
}

export interface TableProps<Row> {
  /** Visible or screen-reader caption that names the table. */
  caption: string;
  /** Hides the caption visually but keeps it for assistive technology. */
  hideCaption?: boolean;
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  sort?: SortState | null;
  defaultSort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  /** Shown instead of the body when there are no rows. */
  emptyMessage?: ReactNode;
  className?: string;
}

/** Stable sort by a column. Strings use the pt-BR collation, numbers compare numerically. */
export const sortRows = <Row,>(
  rows: readonly Row[],
  column: TableColumn<Row> | undefined,
  direction: SortDirection,
): Row[] => {
  const getValue = column?.sortValue;
  if (!getValue) return [...rows];
  const factor = direction === 'ascending' ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const left = getValue(a.row);
      const right = getValue(b.row);
      const compared =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), 'pt-BR', { numeric: true });
      return compared * factor || a.index - b.index;
    })
    .map(({ row }) => row);
};

/** Cycle used by the sort buttons: none -> ascending -> descending -> none. */
export const nextSort = (current: SortState | null, columnId: string): SortState | null => {
  if (current?.columnId !== columnId) return { columnId, direction: 'ascending' };
  return current.direction === 'ascending' ? { columnId, direction: 'descending' } : null;
};

const SORT_LABEL: Record<SortDirection, string> = {
  ascending: 'ordem crescente',
  descending: 'ordem decrescente',
};

/**
 * Data table with sortable columns (`aria-sort` on the header, a real button inside) and a
 * responsive layout: below 40rem every row turns into a labelled card. Explicit ARIA roles keep
 * the table semantics when CSS changes `display`, which some screen readers otherwise drop.
 */
export function Table<Row>({
  caption,
  hideCaption = false,
  columns,
  rows,
  getRowId,
  sort,
  defaultSort = null,
  onSortChange,
  emptyMessage = 'Nada para mostrar.',
  className,
}: TableProps<Row>) {
  const [current, setSort] = useControllableState<SortState | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const sorted = useMemo(
    () =>
      current
        ? sortRows(
            rows,
            columns.find((column) => column.id === current.columnId),
            current.direction,
          )
        : rows,
    [rows, columns, current],
  );

  return (
    <div className={cx('nui-table-wrap', className)}>
      <table className="nui-table" role="table">
        <caption className={cx('nui-table__caption', hideCaption && 'nui-visually-hidden')}>
          {caption}
        </caption>
        <thead role="rowgroup" className="nui-table__head">
          <tr role="row">
            {columns.map((column) => {
              const direction = current?.columnId === column.id ? current.direction : undefined;
              return (
                <th
                  key={column.id}
                  scope="col"
                  role="columnheader"
                  aria-sort={column.sortable ? (direction ?? 'none') : undefined}
                  data-align={column.align}
                  className="nui-table__th"
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="nui-table__sort nui-focusable"
                      onClick={() => setSort(nextSort(current, column.id))}
                    >
                      {column.header}
                      <span
                        className="nui-table__sort-icon"
                        data-direction={direction}
                        aria-hidden="true"
                      />
                      <span className="nui-visually-hidden">
                        {direction ? `, ${SORT_LABEL[direction]}` : ', clique para ordenar'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {sorted.length === 0 ? (
            <tr role="row">
              <td role="cell" colSpan={columns.length} className="nui-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={getRowId(row)} role="row" className="nui-table__row">
                {columns.map((column) =>
                  column.isRowHeader ? (
                    <th
                      key={column.id}
                      scope="row"
                      role="rowheader"
                      data-label={column.header}
                      data-align={column.align}
                      className="nui-table__td nui-table__td--head"
                    >
                      {column.cell(row)}
                    </th>
                  ) : (
                    <td
                      key={column.id}
                      role="cell"
                      data-label={column.header}
                      data-align={column.align}
                      className="nui-table__td"
                    >
                      {column.cell(row)}
                    </td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
