import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldLabel, FieldMessages, useFieldIds } from '../Field/Field';
import './Combobox.css';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  label: ReactNode;
  options: readonly ComboboxOption[];
  /** Selected option value (controlled). `null` means nothing selected. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  /** Text shown when the filter matches nothing. */
  emptyMessage?: string;
  className?: string;
}

/** Lowercase and strip accents so "sao" finds "São Paulo". */
export const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Options whose label contains the query (accent and case insensitive). */
export const filterOptions = (
  options: readonly ComboboxOption[],
  query: string,
): readonly ComboboxOption[] => {
  const needle = normalizeText(query.trim());
  if (!needle) return options;
  return options.filter((option) => normalizeText(option.label).includes(needle));
};

const nextEnabled = (options: readonly ComboboxOption[], from: number, step: 1 | -1): number => {
  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (((from + step * offset) % options.length) + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
};

/**
 * Editable combobox with list autocomplete (APG): the input keeps DOM focus and points to the
 * highlighted option with `aria-activedescendant`. ↓/↑ move, Enter selects, Esc closes, Tab leaves.
 */
export function Combobox({
  label,
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  description,
  error,
  required,
  disabled,
  id,
  emptyMessage = 'Nenhum resultado',
  className,
}: ComboboxProps) {
  const listId = useId();
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: Boolean(error) });
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selected = value === undefined ? internal : value;
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? '';

  const [text, setText] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [filtering, setFiltering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () => (filtering ? filterOptions(options, text) : options),
    [filtering, options, text],
  );

  const commit = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (value === undefined) setInternal(option.value);
    onValueChange?.(option.value);
    setText(option.label);
    setFiltering(false);
    setOpen(false);
    setActive(-1);
  };

  const close = () => {
    setOpen(false);
    setActive(-1);
    setFiltering(false);
    setText(selectedLabel);
  };

  const openList = (startAt: 'first' | 'last' | 'selected') => {
    setOpen(true);
    if (visible.length === 0) return;
    const selectedIndex = visible.findIndex((option) => option.value === selected);
    if (startAt === 'selected' && selectedIndex >= 0) setActive(selectedIndex);
    else setActive(nextEnabled(visible, startAt === 'last' ? 0 : -1, startAt === 'last' ? -1 : 1));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) openList('selected');
      else if (visible.length > 0) setActive(nextEnabled(visible, active, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openList('last');
      else if (visible.length > 0) setActive(nextEnabled(visible, active, -1));
    } else if (event.key === 'Enter') {
      const option = visible[active];
      if (open && option) {
        event.preventDefault();
        commit(option);
      }
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        close();
      }
    }
  };

  const activeId = open && active >= 0 ? `${listId}-option-${active}` : undefined;
  const status = !open
    ? ''
    : visible.length === 0
      ? emptyMessage
      : `${visible.length} ${visible.length === 1 ? 'resultado' : 'resultados'}`;

  return (
    <div className={cx('nui-field', 'nui-combobox', className)}>
      <FieldLabel htmlFor={ids.controlId} required={required}>
        {label}
      </FieldLabel>
      <div className="nui-combobox__wrap">
        <input
          ref={inputRef}
          id={ids.controlId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
          className="nui-control nui-combobox__input nui-focusable"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFiltering(true);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          onFocus={(event) => event.target.select()}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Mostrar opções"
          disabled={disabled}
          className="nui-combobox__toggle"
          // Keep focus in the input so blur does not close the list before the click lands.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            inputRef.current?.focus();
            if (open) close();
            else openList('selected');
          }}
        >
          <span className="nui-combobox__caret" aria-hidden="true" />
        </button>
        <ul
          id={listId}
          role="listbox"
          aria-label={typeof label === 'string' ? label : undefined}
          hidden={!open}
          className="nui-combobox__list"
        >
          {visible.map((option, index) => (
            // Options are driven by the input (aria-activedescendant); click is a pointer shortcut.
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={option.value}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={option.value === selected}
              aria-disabled={option.disabled || undefined}
              data-active={index === active}
              className="nui-combobox__option"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(option)}
              onMouseMove={() => !option.disabled && setActive(index)}
            >
              <span>{option.label}</span>
              {option.description ? (
                <span className="nui-combobox__description">{option.description}</span>
              ) : null}
            </li>
          ))}
          {visible.length === 0 ? (
            <li role="presentation" className="nui-combobox__empty">
              {emptyMessage}
            </li>
          ) : null}
        </ul>
      </div>
      <FieldMessages ids={ids} description={description} error={error} />
      <span className="nui-visually-hidden" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
