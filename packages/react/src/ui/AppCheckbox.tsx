import { Checkbox, theme } from 'antd';
import { useId, type ReactElement } from 'react';

export interface AppCheckboxProps {
  checked?: boolean;
  label: string;
  disabled?: boolean;
  indeterminate?: boolean;
  errorMessage?: string;
  onChange?: (checked: boolean) => void;
}

export function AppCheckbox({
  checked,
  label,
  disabled = false,
  indeterminate = false,
  errorMessage,
  onChange,
}: AppCheckboxProps): ReactElement {
  const id = useId();
  const { token } = theme.useToken();
  return (
    <div>
      <Checkbox
        checked={checked}
        disabled={disabled}
        indeterminate={indeterminate}
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? `${id}-message` : undefined}
        onChange={(event) => onChange?.(event.target.checked)}
      >
        {label}
      </Checkbox>
      {errorMessage ? (
        <div
          id={`${id}-message`}
          role="alert"
          style={{ color: token.colorError, fontSize: token.fontSizeSM }}
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
