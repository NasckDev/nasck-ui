import { Pagination } from 'antd';
import type { ReactElement } from 'react';

export interface AppPaginationProps {
  current?: number;
  total: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  simple?: boolean;
  disabled?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

export function AppPagination({
  current,
  total,
  pageSize = 10,
  showSizeChanger = false,
  simple = false,
  disabled = false,
  onChange,
}: AppPaginationProps): ReactElement {
  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      showSizeChanger={showSizeChanger}
      simple={simple}
      disabled={disabled}
      showTotal={(count, range) => `${range[0]}-${range[1]} de ${count}`}
      onChange={(page, size) => onChange?.(page, size)}
    />
  );
}
