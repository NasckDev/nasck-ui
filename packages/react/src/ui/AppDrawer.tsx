import { Drawer } from 'antd';
import type { ReactElement, ReactNode } from 'react';

export interface AppDrawerProps {
  open: boolean;
  title: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: number;
  closable?: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export function AppDrawer({
  open,
  title,
  placement = 'right',
  width = 420,
  closable = true,
  onClose,
  children,
}: AppDrawerProps): ReactElement {
  return (
    <Drawer
      open={open}
      title={title}
      placement={placement}
      size={width}
      closable={closable}
      destroyOnHidden
      onClose={() => onClose?.()}
    >
      {children}
    </Drawer>
  );
}
