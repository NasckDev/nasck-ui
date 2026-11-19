import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import './Badge.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  tone?: BadgeTone;
}

/** Static status label. Meaning is carried by the text, never by color alone. */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span {...rest} className={cx('nui-badge', className)} data-tone={tone} />;
}
