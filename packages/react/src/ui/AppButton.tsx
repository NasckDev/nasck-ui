import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ButtonVariant, ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { renderIcon, toAntSize } from './shared.tsx';

export interface AppButtonProps {
  variant?: ButtonVariant;
  size?: ControlSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  danger?: boolean;
  block?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
}

/**
 * O estado de carregamento usa icone giratorio e aria-busy em vez da prop loading do antd, que
 * cobre o botao com uma camada translucida e derruba o contraste do texto abaixo de AA.
 */
export function AppButton({
  variant = 'default',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  danger = false,
  block = false,
  htmlType = 'button',
  onClick,
  children,
}: AppButtonProps): ReactElement {
  return (
    <Button
      type={variant}
      size={toAntSize(size)}
      aria-busy={loading || undefined}
      disabled={disabled}
      icon={loading ? <LoadingOutlined /> : renderIcon(icon)}
      danger={danger}
      block={block}
      htmlType={htmlType}
      onClick={loading ? undefined : onClick}
    >
      {children}
    </Button>
  );
}
