import { actionDocs } from './actions';
import { contentDocs } from './content';
import { dataDocs } from './data';
import { extras } from './extras';
import { formDocs } from './forms';
import { overlayDocs } from './overlays';
import type { ComponentDoc } from './types';

export const GROUPS: ReadonlyArray<ComponentDoc['group']> = [
  'Ações',
  'Formulários',
  'Navegação e sobreposição',
  'Dados',
  'Conteúdo e feedback',
];

const merge = (doc: ComponentDoc): ComponentDoc => ({ ...doc, ...extras[doc.slug] });

export const componentDocs: readonly ComponentDoc[] = [
  ...actionDocs,
  ...formDocs,
  ...overlayDocs,
  ...contentDocs,
  ...dataDocs,
].map(merge);

export const findDoc = (slug: string): ComponentDoc | undefined =>
  componentDocs.find((doc) => doc.slug === slug);
