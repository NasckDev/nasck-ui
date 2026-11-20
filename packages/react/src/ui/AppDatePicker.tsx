import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { ControlSize } from '@nasckdev/nasck-ui-tokens';
import { useId, type ReactElement } from 'react';
import { Field, describedBy, toAntSize } from './shared.tsx';

const ISO = 'YYYY-MM-DD';

export interface AppDatePickerProps {
  /** Data no formato ISO (AAAA-MM-DD). */
  value?: string | null;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  size?: ControlSize;
  disabled?: boolean;
  allowClear?: boolean;
  onChange?: (value: string | null) => void;
}

export function AppDatePicker({
  value,
  label,
  placeholder = 'DD/MM/AAAA',
  hint,
  errorMessage,
  size = 'medium',
  disabled = false,
  allowClear = true,
  onChange,
}: AppDatePickerProps): ReactElement {
  const id = useId();
  const parsed = value ? dayjs(value, ISO) : value === null ? null : undefined;
  return (
    <Field id={id} label={label} hint={hint} errorMessage={errorMessage}>
      <DatePicker
        id={id}
        value={parsed}
        format="DD/MM/YYYY"
        placeholder={placeholder}
        size={toAntSize(size)}
        disabled={disabled}
        allowClear={allowClear}
        status={errorMessage ? 'error' : undefined}
        aria-describedby={describedBy(id, hint, errorMessage)}
        style={{ width: '100%' }}
        onChange={(next) => onChange?.(next ? next.format(ISO) : null)}
      />
    </Field>
  );
}
