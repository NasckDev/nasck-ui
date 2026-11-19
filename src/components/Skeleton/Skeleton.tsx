import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import './Skeleton.css';

export interface SkeletonProps {
  shape?: 'text' | 'rect' | 'circle';
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  /** Number of text lines (only for `shape="text"`). */
  lines?: number;
  className?: string;
}

/**
 * Loading placeholder. It is decorative (`aria-hidden`): announce loading on the
 * container instead, e.g. `aria-busy="true"` plus a visually hidden status text.
 */
export function Skeleton({ shape = 'text', width, height, lines = 1, className }: SkeletonProps) {
  const count = shape === 'text' ? Math.max(1, lines) : 1;

  return (
    <span className={cx('nui-skeleton-group', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="nui-skeleton"
          data-shape={shape}
          style={{ width: index === count - 1 && count > 1 ? '60%' : width, height }}
        />
      ))}
    </span>
  );
}
