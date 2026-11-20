import { Tooltip } from 'antd';
import type { ReactElement, ReactNode } from 'react';

export interface AppTooltipProps {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children?: ReactNode;
}

export function AppTooltip({ title, placement = 'top', children }: AppTooltipProps): ReactElement {
  return (
    <Tooltip title={title} placement={placement}>
      <span style={{ display: 'inline-flex' }}>{children}</span>
    </Tooltip>
  );
}
