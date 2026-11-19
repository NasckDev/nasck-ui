import { cloneElement, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Tooltip.css';

type DescribableProps = { 'aria-describedby'?: string };

export interface TooltipProps {
  /** Supplementary text. Never put essential information or interactive content here. */
  content: ReactNode;
  /** A single focusable element (Button, IconButton, link...). */
  children: ReactElement<DescribableProps>;
  placement?: 'top' | 'bottom';
  className?: string;
}

/**
 * Tooltip following the APG tooltip pattern: shown on hover and keyboard focus,
 * hidden on blur, mouse leave or Escape, and linked to the trigger via `aria-describedby`.
 */
export function Tooltip({ content, children, placement = 'top', className }: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const describedBy = [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ');
  const show = () => setIsOpen(true);
  const hide = () => setIsOpen(false);

  return (
    // Hover/focus listeners live on the wrapper; the interactive element is the child.
    <span
      className={cx('nui-tooltip', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span
        id={tooltipId}
        role="tooltip"
        className="nui-tooltip__bubble"
        data-placement={placement}
        hidden={!isOpen}
      >
        {content}
      </span>
    </span>
  );
}
