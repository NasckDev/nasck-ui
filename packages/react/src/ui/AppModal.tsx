import { LoadingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import type { ReactElement, ReactNode } from 'react';

export interface AppModalProps {
  open: boolean;
  title: string;
  okText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  width?: number;
  closable?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
}

export function AppModal({
  open,
  title,
  okText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  danger = false,
  width = 520,
  closable = true,
  onOk,
  onCancel,
  children,
}: AppModalProps): ReactElement {
  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{
        danger,
        icon: loading ? <LoadingOutlined /> : undefined,
        'aria-busy': loading || undefined,
        style: loading ? { pointerEvents: 'none' } : undefined,
      }}
      width={width}
      closable={closable}
      destroyOnHidden
      onOk={() => onOk?.()}
      onCancel={() => onCancel?.()}
    >
      {children}
    </Modal>
  );
}
