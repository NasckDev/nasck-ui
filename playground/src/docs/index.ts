import { actionDocs } from './actions';
import { contentDocs } from './content';
import { formDocs } from './forms';
import { overlayDocs } from './overlays';
import type { ComponentDoc } from './types';

export const componentDocs: readonly ComponentDoc[] = [
  ...actionDocs,
  ...formDocs,
  ...overlayDocs,
  ...contentDocs,
];

export const findDoc = (slug: string): ComponentDoc | undefined =>
  componentDocs.find((doc) => doc.slug === slug);
