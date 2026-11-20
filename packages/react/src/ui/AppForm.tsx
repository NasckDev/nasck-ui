import { Form } from 'antd';
import type { ControlSize } from '@nasckdev/nasck-ui-tokens';
import { useId, type ReactElement, type ReactNode } from 'react';
import { toAntSize } from './shared.tsx';

export interface AppFormProps {
  layout?: 'vertical' | 'horizontal' | 'inline';
  disabled?: boolean;
  size?: ControlSize;
  onSubmit?: () => void;
  children?: ReactNode;
}

export function AppForm({
  layout = 'vertical',
  disabled = false,
  size = 'medium',
  onSubmit,
  children,
}: AppFormProps): ReactElement {
  return (
    <Form
      layout={layout}
      disabled={disabled}
      size={toAntSize(size)}
      onFinish={() => onSubmit?.()}
      noValidate
    >
      {children}
    </Form>
  );
}

export interface AppFormItemProps {
  label?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  children?: ReactNode;
}

/** Agrupa um controle (ou varios) sob um rotulo; o grupo e rotulado para leitor de tela. */
export function AppFormItem({
  label,
  hint,
  errorMessage,
  required = false,
  children,
}: AppFormItemProps): ReactElement {
  const labelId = useId();
  return (
    <Form.Item
      label={label ? <span id={labelId}>{label}</span> : undefined}
      extra={hint}
      help={errorMessage}
      validateStatus={errorMessage ? 'error' : undefined}
      required={required}
    >
      <div role="group" aria-labelledby={label ? labelId : undefined}>
        {children}
      </div>
    </Form.Item>
  );
}
