import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  formatCell,
  type ControlSize,
  type TableColumn,
  type TableRow,
} from '@nasckdev/nasck-ui-tokens';
import type { KeyboardEvent, ReactElement } from 'react';
import { AppEmpty } from './AppEmpty.tsx';
import { toAntSize } from './shared.tsx';

export interface AppTableProps {
  columns: TableColumn[];
  data: TableRow[];
  rowKey?: string;
  loading?: boolean;
  emptyText?: string;
  pageSize?: number;
  pagination?: boolean;
  size?: ControlSize;
  onRowClick?: (row: TableRow) => void;
}

function compare(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR');
}

export function AppTable({
  columns,
  data,
  rowKey = 'id',
  loading = false,
  emptyText = 'Nenhum registro encontrado',
  pageSize = 10,
  pagination = true,
  size = 'medium',
  onRowClick,
}: AppTableProps): ReactElement {
  const antColumns: ColumnsType<TableRow> = columns.map((column) => ({
    key: column.key,
    title: column.title,
    dataIndex: column.key,
    align:
      column.align ??
      (column.format === 'number' || column.format === 'currency' ? 'right' : 'left'),
    width: column.width,
    sorter: column.sortable ? (a, b) => compare(a[column.key], b[column.key]) : undefined,
    render: (value: string | number | null) => formatCell(value, column.format),
  }));

  return (
    <Table<TableRow>
      columns={antColumns}
      dataSource={[...data]}
      rowKey={rowKey}
      loading={loading}
      size={toAntSize(size)}
      scroll={{ x: 'max-content' }}
      pagination={pagination ? { pageSize, showSizeChanger: false, hideOnSinglePage: true } : false}
      locale={{ emptyText: <AppEmpty title={emptyText} image="simple" /> }}
      onRow={
        onRowClick
          ? (row) => ({
              tabIndex: 0,
              style: { cursor: 'pointer' },
              onClick: () => onRowClick(row),
              onKeyDown: (event: KeyboardEvent) => {
                if (event.key === 'Enter') onRowClick(row);
              },
            })
          : undefined
      }
    />
  );
}
