import axe from 'axe-core';

/**
 * Runs axe-core against a rendered container and returns the violations.
 * `color-contrast` is disabled because jsdom has no layout/paint engine;
 * contrast is verified in Storybook through addon-a11y instead.
 */
export const axeViolations = async (container: Element): Promise<axe.Result[]> => {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations;
};
