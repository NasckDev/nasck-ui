import { useEffect, useState } from 'react';

/** Reads the route from the hash, e.g. `#/componentes/button` -> `/componentes/button`. */
export const parseRoute = (hash: string): string => {
  const path = hash.replace(/^#/, '');
  return path.startsWith('/') ? path : `/${path}`;
};

/** Hash routing keeps the app working under any subpath on static hosting, including reloads. */
export const useHashRoute = (): string => {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const handleChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);
  return route;
};

export const href = (path: string): string => `#${path}`;
