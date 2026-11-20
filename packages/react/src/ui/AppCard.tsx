import { Card } from 'antd';
import type { ReactElement, ReactNode } from 'react';

export interface AppCardProps {
  title?: string;
  extra?: string;
  loading?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  size?: 'default' | 'small';
  children?: ReactNode;
}

export function AppCard({
  title,
  extra,
  loading = false,
  bordered = true,
  hoverable = false,
  size = 'default',
  children,
}: AppCardProps): ReactElement {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      variant={bordered ? 'outlined' : 'borderless'}
      hoverable={hoverable}
      size={size}
    >
      {children}
    </Card>
  );
}
