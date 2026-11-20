import { Switch } from 'antd';
import { useId, type ReactElement } from 'react';

export interface AppSwitchProps {
  checked?: boolean;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium';
  onChange?: (checked: boolean) => void;
}

export function AppSwitch({
  checked,
  label,
  disabled = false,
  loading = false,
  size = 'medium',
  onChange,
}: AppSwitchProps): ReactElement {
  const id = useId();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Switch
        checked={checked}
        disabled={disabled}
        loading={loading}
        size={size === 'small' ? 'small' : 'default'}
        aria-labelledby={id}
        onChange={(next) => onChange?.(next)}
      />
      <span id={id}>{label}</span>
    </span>
  );
}
