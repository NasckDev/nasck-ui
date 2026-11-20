import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  /** Allows several panels open at once. Defaults to one at a time. */
  multiple?: boolean;
  /** Ids of the open panels (controlled). */
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (open: readonly string[]) => void;
  /** Heading level of each title, so the accordion fits the page outline. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

/** Next enabled header index for ↑/↓/Home/End, wrapping around. Returns `current` if none. */
export const nextHeaderIndex = (
  items: readonly AccordionItem[],
  current: number,
  key: 'ArrowDown' | 'ArrowUp' | 'Home' | 'End',
): number => {
  const enabled = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled);
  if (enabled.length === 0) return current;
  if (key === 'Home') return enabled[0]?.index ?? current;
  if (key === 'End') return enabled[enabled.length - 1]?.index ?? current;
  const position = enabled.findIndex(({ index }) => index === current);
  const step = key === 'ArrowDown' ? 1 : -1;
  return enabled[(position + step + enabled.length) % enabled.length]?.index ?? current;
};

const isHeaderKey = (key: string): key is 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' =>
  key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End';

/**
 * Accordion following the WAI-ARIA APG pattern: each title is a button inside a heading,
 * `aria-expanded`/`aria-controls` link it to its region, and ↑/↓/Home/End move between headers.
 */
export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  headingLevel = 3,
  className,
}: AccordionProps) {
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const Heading = `h${headingLevel}` as const;
  const [open, setOpen] = useControllableState<readonly string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const toggle = (id: string) => {
    if (open.includes(id)) {
      setOpen(open.filter((openId) => openId !== id));
      return;
    }
    setOpen(multiple ? [...open, id] : [id]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isHeaderKey(event.key)) return;
    event.preventDefault();
    buttons.current[nextHeaderIndex(items, index, event.key)]?.focus();
  };

  return (
    <div className={cx('nui-accordion', className)}>
      {items.map((item, index) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="nui-accordion__item" data-open={isOpen}>
            <Heading className="nui-accordion__heading">
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                id={`${baseId}-header-${item.id}`}
                className="nui-accordion__trigger nui-focusable"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel-${item.id}`}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="nui-accordion__title">{item.title}</span>
                <span className="nui-accordion__chevron" aria-hidden="true" />
              </button>
            </Heading>
            <div
              role="region"
              id={`${baseId}-panel-${item.id}`}
              aria-labelledby={`${baseId}-header-${item.id}`}
              className="nui-accordion__panel"
            >
              <div className="nui-accordion__panel-inner">
                <div className="nui-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
