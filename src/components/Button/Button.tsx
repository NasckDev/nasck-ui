import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets `aria-busy` and ignores clicks while keeping focus on the button. */
  loading?: boolean;
  /** Accessible text announced while loading. Defaults to "Carregando". */
  loadingLabel?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function Spinner() {
  return <span className="nui-spinner" aria-hidden="true" />;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel = 'Carregando',
  startIcon,
  endIcon,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...rest}
      type={type}
      className={cx('nui-button', 'nui-focusable', className)}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
    >
      {loading ? <Spinner /> : startIcon}
      <span className="nui-button__label">{children}</span>
      {loading ? <span className="nui-visually-hidden">{loadingLabel}</span> : endIcon}
    </button>
  );
}
