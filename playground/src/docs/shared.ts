import type { ControlValues } from './types';

export const bool = (values: ControlValues, name: string): boolean => Boolean(values[name]);

export const str = (values: ControlValues, name: string): string => String(values[name] ?? '');

/** Comma separated text from the props panel, as a clean list. */
export const csv = (values: ControlValues, name: string): string[] =>
  str(values, name)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

/** Single-quoted TS string literal. */
export const quote = (text: string): string =>
  "'" + text.replaceAll('\\', '\\\\').replaceAll("'", "\\'") + "'";

/** Double-quoted JSX attribute: `name="value"`. */
export const attr = (name: string, text: string): string =>
  name + '="' + text.replaceAll('"', '&quot;') + '"';

/** Lowercase, no accents, dashes: stable `value` for options generated from labels. */
export const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** `const options = [{ value, label }, ...]` source text for a list of labels. */
export const optionsSource = (labels: readonly string[], name = 'options'): string =>
  'const ' +
  name +
  ' = [\n' +
  labels
    .map((label) => '  { value: ' + quote(slugify(label)) + ', label: ' + quote(label) + ' },')
    .join('\n') +
  '\n];';

export const optionObjects = (labels: readonly string[]): Array<{ value: string; label: string }> =>
  labels.map((label) => ({ value: slugify(label), label }));
