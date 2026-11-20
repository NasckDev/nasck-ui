import { useEffect, useState } from 'react';
import { findMeta, loadDoc } from '../docs';
import type { ComponentDoc } from '../docs/types';
import { ComponentPage } from './ComponentPage';

/** Loads one component's docs on demand and renders them; the heading is there from the first paint. */
export function ComponentRoute({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState<{ slug: string; doc: ComponentDoc | undefined } | null>(
    null,
  );
  const meta = findMeta(slug);

  useEffect(() => {
    let cancelled = false;
    loadDoc(slug).then((doc) => {
      if (!cancelled) setLoaded({ slug, doc });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!meta) return null;
  return <ComponentPage meta={meta} doc={loaded?.slug === slug ? loaded.doc : undefined} />;
}
