import { useEffect, useRef, useState } from 'react';

/** Open overlays, bottom to top. Only the top layer reacts to Escape and traps Tab. */
const stack: symbol[] = [];

interface LayerOptions {
  active: boolean;
  /** Called when Escape reaches this layer while it is the top one. */
  onEscape?: () => void;
}

/**
 * Registers an overlay (dialog, tooltip, toast under the pointer...) in the layer stack.
 * Escape is ignored when a nested control already handled it (`defaultPrevented`) or when
 * a layer above this one is open, so a tooltip inside a dialog closes alone first.
 */
export const useLayer = ({ active, onEscape }: LayerOptions): { isTop: () => boolean } => {
  const idRef = useRef<symbol>(Symbol('nui-layer'));
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return undefined;
    const id = idRef.current;
    stack.push(id);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (stack[stack.length - 1] !== id) return;
      event.preventDefault();
      onEscapeRef.current?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const index = stack.indexOf(id);
      if (index >= 0) stack.splice(index, 1);
    };
  }, [active]);

  // Stable identity: consumers can list it in effect dependencies without re-running them.
  const [api] = useState(() => ({ isTop: () => stack[stack.length - 1] === idRef.current }));
  return api;
};
