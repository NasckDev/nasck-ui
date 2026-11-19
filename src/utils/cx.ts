type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny replacement for `clsx` to keep the bundle dependency-free. */
export const cx = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
