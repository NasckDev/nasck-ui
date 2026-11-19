import type { ReactNode } from 'react';

export interface Demo {
  title: string;
  /** Short explanation shown under the title, e.g. how the state behaves. */
  note?: string;
  preview: ReactNode;
  /** Copyable source for the example. */
  code: string;
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

export interface ComponentDoc {
  slug: string;
  name: string;
  group: 'Ações' | 'Formulários' | 'Navegação e sobreposição' | 'Conteúdo e feedback';
  summary: string;
  /** Native element / ARIA pattern the component is built on. */
  semantics: string;
  keyboard: readonly KeyRow[];
  aria: readonly string[];
  props: readonly PropRow[];
  demos: readonly Demo[];
}
