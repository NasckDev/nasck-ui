import type { ReactNode } from 'react';

export interface Demo {
  title: string;
  /** Short explanation shown under the title, e.g. how the state behaves. */
  note?: string;
  preview: ReactNode;
  /** Copyable source for the example (JSX, optionally preceded by hooks). */
  code: string;
  /** Data the example needs (arrays, interfaces): printed above the component in the snippet. */
  setup?: string;
}

export interface KeyRow {
  keys: string;
  action: string;
}

export interface PropRow {
  name: string;
  type: string;
  description: string;
}

export type ControlValue = string | boolean;
export type ControlValues = Record<string, ControlValue>;

export type Control =
  | { name: string; kind: 'select'; options: readonly string[]; default: string }
  | { name: string; kind: 'boolean'; default: boolean }
  | { name: string; kind: 'text'; default: string };

/** Interactive playground: a props panel drives a live preview and the generated code. */
export interface Playground {
  controls: readonly Control[];
  render: (values: ControlValues) => ReactNode;
  code: (values: ControlValues) => string;
  /** Data the generated code refers to (e.g. an `options` array built from the panel). */
  setup?: (values: ControlValues) => string;
}

export interface AnatomyPart {
  label: string;
  description: string;
  /** CSS selector (inside the stage) of the element this part names. */
  selector: string;
}

export interface Tip {
  text: string;
  code?: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  group: 'Ações' | 'Formulários' | 'Navegação e sobreposição' | 'Conteúdo e feedback' | 'Dados';
  summary: string;
  /** Native element / ARIA pattern the component is built on. */
  semantics: string;
  keyboard: readonly KeyRow[];
  aria: readonly string[];
  props: readonly PropRow[];
  demos: readonly Demo[];
  playground?: Playground;
  anatomy?: readonly AnatomyPart[];
  /** Static markup used by the anatomy figure when the live preview is not enough (overlays). */
  anatomyStage?: ReactNode;
  dos?: readonly Tip[];
  donts?: readonly Tip[];
}
