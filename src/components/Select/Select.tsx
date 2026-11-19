import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldLabel, FieldMessages, useFieldIds } from '../Field/Field';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'children'> {
  label: ReactNode;
  options: readonly SelectOption[];
  /** Renders an empty first option, useful when nothing is selected yet. */
  placeholder?: string;
  description?: ReactNode;
  error?: ReactNode;
}

/**
 * Single-choice picker built on the native `<select>`: it inherits platform keyboard
 * support, mobile pickers and screen reader semantics without re-implementing a listbox.
 */
export function Select({
  label,
  options,
  placeholder,
  description,
  error,
  id,
  required,
  className,
  ...rest
}: SelectProps) {
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: Boolean(error) });

  return (
    <div className={cx('nui-field', className)}>
      <FieldLabel htmlFor={ids.controlId} required={required}>
        {label}
      </FieldLabel>
      <select
        {...rest}
        id={ids.controlId}
        required={required}
        className="nui-control nui-select nui-focusable"
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessages ids={ids} description={description} error={error} />
    </div>
  );
}
