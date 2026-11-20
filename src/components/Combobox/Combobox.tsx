import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { normalizeText } from '../../utils/text';
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
  /** Field name: the selected value is submitted with the form through a hidden input. */
  name?: string;
  /** Text shown when the filter matches nothing. */
  emptyMessage?: string;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  className?: string;
}

export { normalizeText };

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
 * highlighted option with `aria-activedescendant`. ↓/↑ move, Enter selects, Esc closes (and clears
 * when already closed), Tab leaves. Emptying the field clears the selection to `null`.
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
  name,
  emptyMessage = 'Nenhum resultado',
  clearLabel = 'Limpar seleção',
  className,
}: ComboboxProps) {
  const listId = useId();
  const labelId = useId();
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: Boolean(error) });
  const [internal, setInternal] = useState<string | null>(defaultValue);
  const selected = value === undefined ? internal : value;
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? '';

  const [text, setText] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [filtering, setFiltering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the text in sync when the selection changes from outside (controlled `value`) or when the
  // options arrive after mount, but never while the person is typing.
  const [syncedLabel, setSyncedLabel] = useState(selectedLabel);
  if (syncedLabel !== selectedLabel) {
    setSyncedLabel(selectedLabel);
    if (!filtering) setText(selectedLabel);
  }

  const visible = useMemo(
    () => (filtering ? filterOptions(options, text) : options),
    [filtering, options, text],
  );

  const select = (next: string | null) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const commit = (option: ComboboxOption) => {
    if (option.disabled) return;
    select(option.value);
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

  const clear = () => {
    select(null);
    setText('');
    setFiltering(false);
    setOpen(false);
    setActive(-1);
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
      } else if (text) {
        event.preventDefault();
        clear();
      }
    }
  };

  const showList = open && visible.length > 0;
  const activeId = showList && active >= 0 ? `${listId}-option-${active}` : undefined;
  const status = !open
    ? ''
    : visible.length === 0
      ? emptyMessage
      : `${visible.length} ${visible.length === 1 ? 'resultado' : 'resultados'}`;

  return (
    <div className={cx('nui-field', 'nui-combobox', className)}>
      <FieldLabel id={labelId} htmlFor={ids.controlId} required={required}>
        {label}
      </FieldLabel>
      <div className="nui-combobox__wrap">
        <input
          ref={inputRef}
          id={ids.controlId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
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
            const next = event.target.value;
            setText(next);
            setFiltering(true);
            setOpen(true);
            setActive(-1);
            if (next === '' && selected !== null) select(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          onFocus={(event) => event.target.select()}
        />
        {name ? <input type="hidden" name={name} value={selected ?? ''} /> : null}
        {selected !== null && !disabled ? (
          <button
            type="button"
            tabIndex={-1}
            aria-label={clearLabel}
            className="nui-combobox__clear"
            // Keep focus in the input so blur does not interfere with the click.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
        <button
          type="button"
          tabIndex={-1}
          aria-label="Mostrar opções"
          disabled={disabled}
          className="nui-combobox__toggle"
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
          aria-labelledby={labelId}
          hidden={!showList}
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
        </ul>
        {open && visible.length === 0 ? (
          <p className="nui-combobox__list nui-combobox__empty">{emptyMessage}</p>
        ) : null}
      </div>
      <FieldMessages ids={ids} description={description} error={error} />
      <span className="nui-visually-hidden" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
