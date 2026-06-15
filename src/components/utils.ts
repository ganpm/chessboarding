
// Utility function to conditionally join class names
export const clsx = (...classes: (string | false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};