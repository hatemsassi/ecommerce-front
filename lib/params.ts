/** Parses a route or search param as a positive integer; anything else yields undefined. */
export function parsePositiveInt(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const parsed = Number(raw);
  return parsed > 0 && Number.isSafeInteger(parsed) ? parsed : undefined;
}
