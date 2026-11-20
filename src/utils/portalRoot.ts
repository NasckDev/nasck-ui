/** Attribute that keeps an element interactive while a modal makes the rest of the page inert. */
export const PERSISTENT_ATTRIBUTE = 'data-nui-persistent';

/**
 * Body-level container for popups and live regions (menus, toasts). It escapes ancestors with
 * `transform` or `overflow`, and stays outside the modal's `inert` treatment.
 */
export const getPersistentRoot = (): HTMLElement => {
  const existing = document.body.querySelector<HTMLElement>(`:scope > [${PERSISTENT_ATTRIBUTE}]`);
  if (existing) return existing;
  const root = document.createElement('div');
  root.className = 'nui-layer-root';
  root.setAttribute(PERSISTENT_ATTRIBUTE, '');
  document.body.appendChild(root);
  return root;
};
