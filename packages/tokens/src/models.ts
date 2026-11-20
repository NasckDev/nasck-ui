/** Tipos compartilhados do contrato: os dois frameworks usam exatamente estes formatos. */

export const ICON_NAMES = [
  'plus',
  'search',
  'delete',
  'edit',
  'download',
  'upload',
  'check',
  'close',
  'user',
  'setting',
  'bell',
  'info',
  'warning',
  'mail',
  'calendar',
  'filter',
  'reload',
  'more',
  'arrow-up',
  'arrow-down',
  'home',
  'eye',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
export type ControlSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type Tone = 'success' | 'warning' | 'error' | 'info';
export type TagColor = 'default' | Tone | 'processing';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type CellFormat = 'text' | 'number' | 'currency' | 'date';
export type Align = 'left' | 'center' | 'right';

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  align?: Align;
  width?: number;
  format?: CellFormat;
}

export type TableRow = Readonly<Record<string, string | number | null>>;

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  content?: string;
}

export interface StepItem {
  title: string;
  description?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  danger?: boolean;
}

export type ChartType = 'line' | 'area' | 'bar' | 'pie';
export type ValueFormat = 'number' | 'currency' | 'percent';

export interface ChartSeries {
  name: string;
  data: number[];
}

const LOCALE = 'pt-BR';
const COMPACT_FROM = 100000;

export function formatValue(value: number, format: ValueFormat = 'number'): string {
  if (format === 'currency') {
    const compact = Math.abs(value) >= COMPACT_FROM;
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: 'BRL',
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact ? 1 : 2,
    }).format(value);
  }
  if (format === 'percent') {
    return new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 1 }).format(
      value,
    );
  }
  return new Intl.NumberFormat(LOCALE).format(value);
}

/** Formata o valor de uma celula de tabela. Valores ausentes viram um travessao. */
export function formatCell(
  value: string | number | null | undefined,
  format: CellFormat = 'text',
): string {
  if (value === null || value === undefined || value === '') return '—';
  if (format === 'number' && typeof value === 'number') return formatValue(value, 'number');
  if (format === 'currency' && typeof value === 'number') return formatValue(value, 'currency');
  if (format === 'date') {
    const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString(LOCALE);
  }
  return String(value);
}
