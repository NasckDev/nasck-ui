import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Accessible name of the tablist. */
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

type NavigationKey = 'ArrowRight' | 'ArrowLeft' | 'Home' | 'End';

const isNavigationKey = (key: string): key is NavigationKey =>
  key === 'ArrowRight' || key === 'ArrowLeft' || key === 'Home' || key === 'End';

/** Index of the next enabled tab for a navigation key, wrapping around the ends. */
export const nextEnabledIndex = (
  items: readonly TabItem[],
  current: number,
  key: NavigationKey,
): number => {
  const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
  if (enabled.length === 0) return current;
  if (key === 'Home') return enabled[0]?.index ?? current;
  if (key === 'End') return enabled[enabled.length - 1]?.index ?? current;
  const position = enabled.findIndex(({ index }) => index === current);
  const step = key === 'ArrowRight' ? 1 : -1;
  const next = (position + step + enabled.length) % enabled.length;
  return enabled[next]?.index ?? current;
};

/**
 * Tabs following the WAI-ARIA APG pattern with automatic activation:
 * roving tabindex, ←/→ move and select, Home/End jump to the ends, disabled tabs are skipped.
 */
export function Tabs({ label, items, value, defaultValue, onValueChange, className }: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? '';
  const [selected, setSelected] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isNavigationKey(event.key)) return;
    event.preventDefault();
    const nextIndex = nextEnabledIndex(items, index, event.key);
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    setSelected(nextItem.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cx('nui-tabs', className)}>
      <div role="tablist" aria-label={label} className="nui-tabs__list">
        {items.map((item, index) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              className="nui-tabs__tab nui-focusable"
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== selected}
          tabIndex={0}
          className="nui-tabs__panel nui-focusable"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
