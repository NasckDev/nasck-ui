import type { Control, ControlValues } from '../docs/types';

const MAX_INLINE_PROPS = 2;

const formatProp = (name: string, value: string | boolean): string => {
  if (typeof value === 'boolean') return value ? name : '';
  return `${name}="${value}"`;
};

interface JsxOptions {
  /** Control whose text value becomes the element children instead of a prop. */
  childrenKey?: string;
  /** Props that are not controls but must always appear, e.g. `label="Nome"`. */
  fixed?: readonly string[];
  /** Controls to leave out of the generated code. */
  skip?: readonly string[];
  /** Controls always written, even at their default value (required props such as `label`). */
  always?: readonly string[];
}

/** Builds JSX for `tag`, listing only the props that differ from their default value. */
export const generateJsx = (
  tag: string,
  controls: readonly Control[],
  values: ControlValues,
  options: JsxOptions = {},
): string => {
  const { childrenKey, fixed = [], skip = [], always = [] } = options;
  const props = [
    ...fixed,
    ...controls
      .filter((control) => control.name !== childrenKey && !skip.includes(control.name))
      .filter((control) => values[control.name] !== '')
      .filter(
        (control) => always.includes(control.name) || values[control.name] !== control.default,
      )
      .map((control) => formatProp(control.name, values[control.name] ?? control.default))
      .filter(Boolean),
  ];
  const children = childrenKey ? String(values[childrenKey] ?? '') : '';
  const open =
    props.length > MAX_INLINE_PROPS
      ? `<${tag}\n${props.map((prop) => `  ${prop}`).join('\n')}\n>`
      : `<${tag}${props.length ? ` ${props.join(' ')}` : ''}>`;
  if (!childrenKey)
    return props.length > MAX_INLINE_PROPS ? `${open.slice(0, -2)}\n/>` : `${open.slice(0, -1)} />`;
  return props.length > MAX_INLINE_PROPS
    ? `${open}\n  ${children}\n</${tag}>`
    : `${open}${children}</${tag}>`;
};

export const defaultValues = (controls: readonly Control[]): ControlValues =>
  Object.fromEntries(controls.map((control) => [control.name, control.default]));
