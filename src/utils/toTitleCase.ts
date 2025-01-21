export function toTitleCase(text: string) {
  const parts = text.split('-');
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
