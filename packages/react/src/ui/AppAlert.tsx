import { Alert } from 'antd';
import type { Tone } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';

export interface AppAlertProps {
  type?: Tone;
  title: string;
  description?: string;
  closable?: boolean;
  showIcon?: boolean;
  banner?: boolean;
  onClose?: () => void;
}

export function AppAlert({
  type = 'info',
  title,
  description,
  closable = false,
  showIcon = true,
  banner = false,
  onClose,
}: AppAlertProps): ReactElement {
  return (
    <Alert
      type={type}
      title={title}
      description={description}
      closable={closable ? { onClose: () => onClose?.(), closeIcon: true } : false}
      showIcon={showIcon}
      banner={banner}
    />
  );
}
