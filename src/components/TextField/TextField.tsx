import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { FieldLabel, FieldMessages, useFieldIds } from '../Field/Field';

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  /** Visible label. Always required: placeholders are not labels. */
  label: ReactNode;
  /** Helper text linked through `aria-describedby`. */
  description?: ReactNode;
  /** Error message; sets `aria-invalid` and is linked through `aria-describedby`. */
  error?: ReactNode;
}

export function TextField({
  label,
  description,
  error,
  id,
  required,
  className,
  type = 'text',
  ...rest
}: TextFieldProps) {
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: Boolean(error) });

  return (
    <div className={cx('nui-field', className)}>
      <FieldLabel htmlFor={ids.controlId} required={required}>
        {label}
      </FieldLabel>
      <input
        {...rest}
        id={ids.controlId}
        type={type}
        required={required}
        className="nui-control nui-focusable"
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
      />
      <FieldMessages ids={ids} description={description} error={error} />
    </div>
  );
}
