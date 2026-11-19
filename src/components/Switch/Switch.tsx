import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { FieldMessages, useFieldIds } from '../Field/Field';
import './Switch.css';

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'onChange' | 'value' | 'defaultValue'
> {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * On/off toggle following the WAI-ARIA switch pattern: a `button` with `role="switch"`
 * and `aria-checked`. Space and Enter toggle it natively because it is a real button.
 */
export function Switch({
  label,
  description,
  checked,
  defaultChecked = false,
  onCheckedChange,
  id,
  className,
  onClick,
  ...rest
}: SwitchProps) {
  const [isOn, setIsOn] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const ids = useFieldIds({ id, hasDescription: Boolean(description), hasError: false });

  return (
    <div className={cx('nui-field', 'nui-switch', className)}>
      <div className="nui-switch__row">
        <button
          {...rest}
          id={ids.controlId}
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-describedby={ids.describedBy}
          className="nui-switch__track nui-focusable"
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) setIsOn(!isOn);
          }}
        >
          <span className="nui-switch__thumb" aria-hidden="true" />
        </button>
        <label htmlFor={ids.controlId} className="nui-switch__label">
          {label}
        </label>
      </div>
      <FieldMessages ids={ids} description={description} error={undefined} />
    </div>
  );
}
