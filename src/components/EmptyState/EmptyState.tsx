import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './EmptyState.css';

type HeadingLevel = 2 | 3 | 4;

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  /** Decorative illustration or icon; hidden from assistive technology. */
  icon?: ReactNode;
  /** Primary next step, usually a Button. */
  action?: ReactNode;
  headingLevel?: HeadingLevel;
  className?: string;
}

/** Explains why there is no content and what to do next (empty lists, no results, errors). */
export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 2,
  className,
}: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cx('nui-empty-state', className)}>
      {icon ? (
        <div className="nui-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <Heading className="nui-empty-state__title">{title}</Heading>
      {description ? <p className="nui-empty-state__description">{description}</p> : null}
      {action ? <div className="nui-empty-state__action">{action}</div> : null}
    </div>
  );
}
