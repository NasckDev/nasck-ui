import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ButtonVariant, ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import type { MouseEvent, ReactElement } from 'react';
import { renderIcon, toAntSize } from './shared.tsx';

export interface AppIconButtonProps {
  icon: IconName;
  /** Nome acessivel do botao (obrigatorio: o botao nao tem texto visivel). */
  label: string;
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function AppIconButton({
  icon,
  label,
  variant = 'text',
  size = 'medium',
  loading = false,
  disabled = false,
  danger = false,
  onClick,
}: AppIconButtonProps): ReactElement {
  return (
    <Button
      type={variant}
      size={toAntSize(size)}
      shape="circle"
      aria-busy={loading || undefined}
      disabled={disabled}
      danger={danger}
      icon={loading ? <LoadingOutlined /> : renderIcon(icon)}
      aria-label={label}
      title={label}
      onClick={loading ? undefined : onClick}
    />
  );
}
