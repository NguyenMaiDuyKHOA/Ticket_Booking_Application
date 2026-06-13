// Joins conditional Tailwind classes without introducing another dependency.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
