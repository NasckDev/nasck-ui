import { useCallback, useState } from 'react';

interface ControllableStateOptions<T> {
  value: T | undefined;
  defaultValue: T;
  onChange: ((value: T) => void) | undefined;
}

/**
 * Supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) usage,
 * the convention every stateful Nasck UI component follows.
 */
export const useControllableState = <T,>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (next: T) => void] => {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [current, setValue];
};
