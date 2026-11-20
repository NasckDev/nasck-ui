import type { Ref, RefCallback } from 'react';

/** Combines refs so a component can use one internally and still forward the consumer's. */
export const mergeRefs =
  <T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> =>
  (node) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    });
  };
