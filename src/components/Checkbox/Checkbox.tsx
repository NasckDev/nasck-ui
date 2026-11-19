import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldMessages, useFieldIds } from '../Field/Field';
import './Checkbox.css';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Mixed state (e.g. "select all" with partial selection). Exposed as `aria-checked="mixed"`. */
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  description,
  error,
  indeterminate = false,
  id,
  className,
  ...rest
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: Boolean(error) });

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx('nui-field', 'nui-checkbox', className)}>
      <div className="nui-checkbox__row">
        <input
          {...rest}
          ref={inputRef}
          id={ids.controlId}
          type="checkbox"
          className="nui-checkbox__input nui-focusable"
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        />
        <label htmlFor={ids.controlId} className="nui-checkbox__label">
          {label}
        </label>
      </div>
      <FieldMessages ids={ids} description={description} error={error} />
    </div>
  );
}
