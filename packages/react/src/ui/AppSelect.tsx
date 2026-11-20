import { Select } from 'antd';
import type { ControlSize, SelectOption } from '@nasckdev/nasck-ui-tokens';
import { useId, type ReactElement } from 'react';
import { Field, describedBy, toAntSize } from './shared.tsx';

export interface AppSelectProps {
  value?: string | string[];
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  size?: ControlSize;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  allowClear?: boolean;
  emptyText?: string;
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
}

export function AppSelect({
  value,
  options,
  placeholder,
  label,
  hint,
  errorMessage,
  size = 'medium',
  disabled = false,
  loading = false,
  searchable = false,
  multiple = false,
  allowClear = false,
  emptyText = 'Nenhuma opção encontrada',
  onChange,
  onSearch,
}: AppSelectProps): ReactElement {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} errorMessage={errorMessage}>
      <Select<string | string[]>
        id={id}
        value={value}
        options={options}
        placeholder={placeholder}
        size={toAntSize(size)}
        disabled={disabled}
        loading={loading}
        showSearch={
          searchable ? { filterOption: true, optionFilterProp: 'label', onSearch } : false
        }
        mode={multiple ? 'multiple' : undefined}
        allowClear={allowClear}
        status={errorMessage ? 'error' : undefined}
        notFoundContent={emptyText}
        aria-describedby={describedBy(id, hint, errorMessage)}
        style={{ width: '100%' }}
        onChange={(next) => onChange?.(next)}
      />
    </Field>
  );
}
