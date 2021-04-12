/**
 * Converte la data in input nel formato yyyy-MM-dd
 * @param date data in formato dd/MM/yyyy
 */
export function formatDateConverter(date: string): string {
  const t: string[] = date.match(/(\d{1}|\d{2})\/(\d{1}|\d{2})\/(\d{4})/);

  const y = t[3];
  const m = t[2].length == 1 ? '0' + t[2] : t[2];
  const d = t[1].length == 1 ? '0' + t[1] : t[1];

  return `${y}-${m}-${d}`;
}