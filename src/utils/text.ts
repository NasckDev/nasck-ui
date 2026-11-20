/** Lowercase and strip accents so "sao" finds "São Paulo". */
export const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
