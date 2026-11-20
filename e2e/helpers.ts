import { createRequire } from 'node:module';
import type { Page } from '@playwright/test';

const require = createRequire(import.meta.url);

export interface AxeViolation {
  id: string;
  impact?: string | null;
  nodes: Array<{ target: unknown[] }>;
}

interface AxeGlobal {
  run: (context: Document, options: object) => Promise<{ violations: AxeViolation[] }>;
}

/** Runs axe-core in the page (real browser, so color-contrast is included) and returns violations. */
export const runAxe = async (page: Page): Promise<AxeViolation[]> => {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: AxeGlobal }).axe;
    const result = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({ target: node.target })),
    }));
  });
};

/** Collects console errors, page errors and HTTP errors for the lifetime of the page. */
export const watchProblems = (page: Page): string[] => {
  const problems: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()} ${response.url()}`);
  });
  return problems;
};

export const gotoRoute = async (page: Page, hash: string): Promise<void> => {
  await page.goto(`./#${hash}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#page-title');
};

export const setTheme = async (page: Page, theme: 'light' | 'dark'): Promise<void> => {
  await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
};
