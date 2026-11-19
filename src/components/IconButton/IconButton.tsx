import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import type { ButtonSize, ButtonVariant } from '../Button/Button';
import '../Button/Button.css';
import './IconButton.css';

export interface IconButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'aria-label'> {
  /** Required accessible name: icon-only controls have no visible text. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      className={cx('nui-button', 'nui-icon-button', 'nui-focusable', className)}
      data-variant={variant}
      data-size={size}
    >
      <span className="nui-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
