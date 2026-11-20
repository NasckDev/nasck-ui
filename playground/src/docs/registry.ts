import type { ComponentDoc } from './types';
import metas from './components/_meta.json';

export interface DocMeta {
  slug: string;
  name: string;
  group: ComponentDoc['group'];
  summary: string;
}

export const GROUPS: ReadonlyArray<ComponentDoc['group']> = [
  'Ações',
  'Formulários',
  'Navegação e sobreposição',
  'Dados',
  'Conteúdo e feedback',
];

export const docMetas = metas as readonly DocMeta[];

export const findMeta = (slug: string): DocMeta | undefined =>
  docMetas.find((meta) => meta.slug === slug);

const loaders = import.meta.glob<{ doc: ComponentDoc }>('./components/*.tsx');

/** Loads one component's documentation on demand (each component is its own chunk). */
export const loadDoc = async (slug: string): Promise<ComponentDoc | undefined> => {
  const loader = loaders[`./components/${slug}.tsx`];
  return loader ? (await loader()).doc : undefined;
};
