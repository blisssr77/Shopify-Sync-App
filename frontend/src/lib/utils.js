/**
 * Tailwind-safe className joiner
 * Removes falsy values and joins classes
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}