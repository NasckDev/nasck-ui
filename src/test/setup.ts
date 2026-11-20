import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  // Body-level layers (menus, toasts) outlive a single render: start each test clean.
  document.querySelectorAll('[data-nui-persistent]').forEach((element) => element.remove());
});
