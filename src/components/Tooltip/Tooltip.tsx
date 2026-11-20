import {
  cloneElement,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useLayer } from '../../utils/layers';
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

const GAP = 8;
const EDGE = 8;

/** Fixed-position style, so the bubble is not clipped by ancestors with `overflow`. */
const placeBubble = (trigger: HTMLElement, placement: 'top' | 'bottom'): CSSProperties => {
  const rect = trigger.getBoundingClientRect();
  const center = Math.min(
    Math.max(rect.left + rect.width / 2, EDGE + 80),
    window.innerWidth - EDGE - 80,
  );
  return placement === 'top'
    ? { left: center, top: rect.top - GAP, transform: 'translate(-50%, -100%)' }
    : { left: center, top: rect.bottom + GAP, transform: 'translate(-50%, 0)' };
};

/**
 * Tooltip following the APG tooltip pattern: shown on hover and keyboard focus,
 * hidden on blur, mouse leave or Escape, and linked to the trigger via `aria-describedby`.
 * Escape closes only the tooltip, even inside a Dialog.
 */
export function Tooltip({ content, children, placement = 'top', className }: TooltipProps) {
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});

  const hide = () => setIsOpen(false);
  const show = () => {
    if (wrapperRef.current) setStyle(placeBubble(wrapperRef.current, placement));
    setIsOpen(true);
  };

  useLayer({ active: isOpen, onEscape: hide });

  const describedBy = [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ');

  return (
    // Hover/focus listeners live on the wrapper; the interactive element is the child.
    <span
      ref={wrapperRef}
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
        style={style}
        hidden={!isOpen}
      >
        {content}
      </span>
    </span>
  );
}
