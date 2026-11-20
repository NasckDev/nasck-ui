import { Badge, Tag, theme } from 'antd';
import type { IconName, TagColor } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';
import { renderIcon } from './shared.tsx';

export interface AppTagProps {
  label: string;
  color?: TagColor;
  icon?: IconName;
  closable?: boolean;
  bordered?: boolean;
  onClose?: () => void;
}

/** "info" nao e uma cor predefinida do antd: vira "processing", que usa a cor informativa do tema. */
function antColor(color: TagColor): string | undefined {
  if (color === 'default') return undefined;
  return color === 'info' ? 'processing' : color;
}

export function AppTag({
  label,
  color = 'default',
  icon,
  closable = false,
  bordered = true,
  onClose,
}: AppTagProps): ReactElement {
  return (
    <Tag
      color={antColor(color)}
      icon={renderIcon(icon)}
      closable={closable}
      variant={bordered ? 'outlined' : 'filled'}
      onClose={() => onClose?.()}
    >
      {label}
    </Tag>
  );
}

export type StatusKind = 'success' | 'warning' | 'error' | 'info' | 'processing' | 'default';

export interface AppStatusProps {
  status: StatusKind;
  label: string;
}

/** Ponto colorido mais texto: a cor nunca e o unico sinal. */
export function AppStatus({ status, label }: AppStatusProps): ReactElement {
  const { token } = theme.useToken();
  if (status === 'info') return <Badge color={token.colorInfo} text={label} />;
  return <Badge status={status} text={label} />;
}
