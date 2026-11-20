import { Skeleton } from 'antd';
import type { ReactElement, ReactNode } from 'react';

export interface AppSkeletonProps {
  loading?: boolean;
  rows?: number;
  avatar?: boolean;
  title?: boolean;
  active?: boolean;
  children?: ReactNode;
}

export function AppSkeleton({
  loading = true,
  rows = 3,
  avatar = false,
  title = true,
  active = true,
  children,
}: AppSkeletonProps): ReactElement {
  return (
    <Skeleton loading={loading} active={active} avatar={avatar} title={title} paragraph={{ rows }}>
      {children}
    </Skeleton>
  );
}
