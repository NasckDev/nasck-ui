import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { getPersistentRoot } from '../../utils/portalRoot';
import { Button, type ButtonSize, type ButtonVariant } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import './Menu.css';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  /** `danger` styles destructive actions. The label must still say what happens. */
  tone?: 'default' | 'danger';
  /** Draws a divider above the item to group related actions. */
  separatorBefore?: boolean;
}

export interface MenuProps {
  /** Accessible name of the trigger, and its visible text unless `iconOnly`. */
  label: string;
  items: readonly MenuItem[];
  icon?: ReactNode;
  /** Renders only the icon (square button). `label` remains the accessible name. */
  iconOnly?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  align?: 'start' | 'end';
  className?: string;
}

type InitialFocus = 'first' | 'last';

const MENU_GAP = 4;
const ESTIMATED_ITEM_HEIGHT = 40;
const TYPEAHEAD_RESET_MS = 600;

/** Next enabled item index. `step` is 1 or -1; wraps around. Returns -1 if none is enabled. */
export const nextMenuIndex = (
  items: readonly MenuItem[],
  current: number,
  step: 1 | -1,
): number => {
  const count = items.length;
  for (let offset = 1; offset <= count; offset += 1) {
    const index = (((current + step * offset) % count) + count) % count;
    if (!items[index]?.disabled) return index;
  }
  return -1;
};

/** First enabled item whose label starts with `query`, searching after `from`. */
export const findByTypeahead = (
  items: readonly MenuItem[],
  query: string,
  from: number,
): number => {
  const needle = query.toLowerCase();
  for (let offset = 1; offset <= items.length; offset += 1) {
    const index = (from + offset + items.length) % items.length;
    const item = items[index];
    if (item && !item.disabled && item.label.toLowerCase().startsWith(needle)) return index;
  }
  return -1;
};

const placeMenu = (
  trigger: HTMLElement,
  align: 'start' | 'end',
  itemCount: number,
): CSSProperties => {
  const rect = trigger.getBoundingClientRect();
  const estimatedHeight = itemCount * ESTIMATED_ITEM_HEIGHT + 16;
  const below = window.innerHeight - rect.bottom;
  const style: CSSProperties = { minWidth: Math.max(rect.width, 192) };
  if (below < estimatedHeight && rect.top > below) {
    style.bottom = window.innerHeight - rect.top + MENU_GAP;
  } else {
    style.top = rect.bottom + MENU_GAP;
  }
  if (align === 'end') style.right = Math.max(window.innerWidth - rect.right, 8);
  else style.left = Math.max(rect.left, 8);
  return style;
};

/**
 * Dropdown menu following the APG "Menu Button" pattern: the trigger opens a `menu` of
 * `menuitem`s, arrows/Home/End move, typing jumps to an item, Esc closes and returns focus.
 */
export function Menu({
  label,
  items,
  icon,
  iconOnly = false,
  variant = 'secondary',
  size = 'md',
  align = 'start',
  className,
}: MenuProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  });
  const pendingFocus = useRef<InitialFocus>('first');
  const typeahead = useRef({ text: '', timer: 0 });

  const openMenu = (initial: InitialFocus) => {
    if (!triggerRef.current) return;
    pendingFocus.current = initial;
    setStyle(placeMenu(triggerRef.current, align, items.length));
    setOpen(true);
  };

  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    // Initial focus runs once per opening: `items` is read through a ref so a parent re-render
    // (new array identity) does not pull focus back to the first item.
    const current = itemsRef.current;
    const initial =
      pendingFocus.current === 'first'
        ? nextMenuIndex(current, -1, 1)
        : nextMenuIndex(current, 0, -1);
    itemRefs.current[initial]?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const inside =
        triggerRef.current?.contains(target) ||
        itemRefs.current.some((node) => node?.contains(target));
      if (!inside) closeMenu(false);
    };
    const handleDismiss = () => closeMenu(false);
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleDismiss);
    window.addEventListener('scroll', handleDismiss, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleDismiss);
      window.removeEventListener('scroll', handleDismiss, true);
    };
  }, [open, closeMenu]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu('last');
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.findIndex((node) => node === document.activeElement);
    const move = (index: number) => {
      event.preventDefault();
      if (index >= 0) itemRefs.current[index]?.focus();
    };
    if (event.key === 'ArrowDown') return move(nextMenuIndex(items, current, 1));
    if (event.key === 'ArrowUp') return move(nextMenuIndex(items, current, -1));
    if (event.key === 'Home') return move(nextMenuIndex(items, -1, 1));
    if (event.key === 'End') return move(nextMenuIndex(items, 0, -1));
    if (event.key === 'Escape') {
      event.preventDefault();
      return closeMenu(true);
    }
    // Tab closes the menu and leaves from the trigger, so focus continues in the page order.
    if (event.key === 'Tab') return closeMenu(true);
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      window.clearTimeout(typeahead.current.timer);
      typeahead.current.text += event.key;
      typeahead.current.timer = window.setTimeout(() => {
        typeahead.current.text = '';
      }, TYPEAHEAD_RESET_MS);
      // A repeated first letter cycles; a longer query keeps the current item as a candidate.
      const from = typeahead.current.text.length > 1 ? current - 1 : current;
      return move(findByTypeahead(items, typeahead.current.text, from));
    }
    return undefined;
  };

  const select = (item: MenuItem) => {
    if (item.disabled) return;
    closeMenu(true);
    item.onSelect?.();
  };

  const triggerProps = {
    ref: triggerRef,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: () => (open ? closeMenu(false) : openMenu('first')),
    onKeyDown: handleTriggerKeyDown,
    className: cx('nui-menu__trigger', className),
  };

  return (
    <span className="nui-menu">
      {iconOnly ? (
        <IconButton {...triggerProps} label={label} icon={icon} variant={variant} size={size} />
      ) : (
        <Button
          {...triggerProps}
          variant={variant}
          size={size}
          startIcon={icon}
          endIcon={<span className="nui-menu__caret" aria-hidden="true" />}
        >
          {label}
        </Button>
      )}
      {open
        ? createPortal(
            // Key handling for the focused item bubbles here, per the APG menu pattern.
            <div
              id={menuId}
              role="menu"
              tabIndex={-1}
              aria-label={label}
              className="nui-menu__list"
              style={style}
              onKeyDown={handleMenuKeyDown}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  role="none"
                  className="nui-menu__row"
                  data-separated={item.separatorBefore}
                >
                  <button
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    aria-disabled={item.disabled || undefined}
                    className="nui-menu__item"
                    data-tone={item.tone ?? 'default'}
                    onClick={() => select(item)}
                  >
                    {item.icon ? (
                      <span className="nui-menu__icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    ) : null}
                    {item.label}
                  </button>
                </div>
              ))}
            </div>,
            getPersistentRoot(),
          )
        : null}
    </span>
  );
}
