import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import type { ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import { useId, type ReactElement } from 'react';
import { Field, describedBy, renderIcon, toAntSize } from './shared.tsx';

// Alvo de 24 px (WCAG 2.2, 2.5.8) para o botao de mostrar ou ocultar a senha.
const TOGGLE_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 24,
  minHeight: 24,
} as const;

export type AppInputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'textarea';

export interface AppInputProps {
  value?: string;
  type?: AppInputType;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  size?: ControlSize;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  prefixIcon?: IconName;
  required?: boolean;
  onChange?: (value: string) => void;
}

export function AppInput({
  value,
  type = 'text',
  label,
  placeholder,
  hint,
  errorMessage,
  size = 'medium',
  disabled = false,
  loading = false,
  allowClear = false,
  prefixIcon,
  required = false,
  onChange,
}: AppInputProps): ReactElement {
  const id = useId();
  const common = {
    id,
    value,
    placeholder,
    disabled,
    allowClear,
    size: toAntSize(size),
    status: errorMessage ? ('error' as const) : undefined,
    required,
    'aria-invalid': errorMessage ? true : undefined,
    'aria-describedby': describedBy(id, hint, errorMessage),
  };
  return (
    <Field id={id} label={label} hint={hint} errorMessage={errorMessage} required={required}>
      {type === 'textarea' ? (
        <Input.TextArea {...common} rows={3} onChange={(event) => onChange?.(event.target.value)} />
      ) : type === 'password' ? (
        <Input.Password
          {...common}
          prefix={renderIcon(prefixIcon)}
          iconRender={(visible) => (
            <span style={TOGGLE_STYLE}>{visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
          )}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <Input
          {...common}
          type={type === 'search' ? 'text' : type}
          prefix={renderIcon(type === 'search' ? (prefixIcon ?? 'search') : prefixIcon)}
          suffix={loading ? <LoadingOutlined aria-label="Carregando" /> : undefined}
          aria-busy={loading || undefined}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </Field>
  );
}
