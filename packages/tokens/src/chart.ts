import type { ResolvedTokens } from './contrast.ts';
import { formatValue, type ChartSeries, type ChartType, type ValueFormat } from './models.ts';

export interface ChartInput {
  type: ChartType;
  categories: string[];
  series: ChartSeries[];
  title?: string;
  valueFormat?: ValueFormat;
  ariaLabel?: string;
}

function str(tokens: ResolvedTokens, key: string, fallback: string): string {
  const value = tokens[key];
  return typeof value === 'string' ? value : fallback;
}

export function chartPalette(tokens: ResolvedTokens): string[] {
  return [
    str(tokens, 'colorPrimary', '#F0501C'),
    str(tokens, 'colorInfo', '#1D4ED8'),
    str(tokens, 'colorSuccess', '#15803D'),
    str(tokens, 'colorWarning', '#9A5B00'),
    str(tokens, 'colorError', '#B91C1C'),
  ];
}

/**
 * Monta a option do ECharts a partir de dados simples e dos tokens do tema.
 * O resultado e o mesmo no React e no Angular.
 */
export function buildChartOption(
  input: ChartInput,
  tokens: ResolvedTokens,
): Record<string, unknown> {
  const text = str(tokens, 'colorText', '#111111');
  const muted = str(tokens, 'colorTextSecondary', '#444444');
  const grid = str(tokens, 'colorBorderSecondary', '#E5E5E5');
  const container = str(tokens, 'colorBgContainer', '#FFFFFF');
  const format = (value: number): string => formatValue(value, input.valueFormat ?? 'number');
  const reduced =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const common = {
    color: chartPalette(tokens),
    backgroundColor: 'transparent',
    animation: !reduced,
    textStyle: { fontFamily: str(tokens, 'fontFamily', 'sans-serif'), color: muted },
    aria: { enabled: true, label: { description: input.ariaLabel } },
    title: input.title
      ? { text: input.title, left: 0, textStyle: { color: text, fontSize: 14, fontWeight: 600 } }
      : undefined,
    tooltip: {
      backgroundColor: container,
      borderColor: grid,
      textStyle: { color: text },
      valueFormatter: (value: unknown) =>
        typeof value === 'number' ? format(value) : String(value),
    },
  };

  if (input.type === 'pie') {
    const first = input.series[0];
    return {
      ...common,
      tooltip: { ...common.tooltip, trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: muted } },
      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          itemStyle: { borderColor: container, borderWidth: 2 },
          label: { show: false },
          data: (first?.data ?? []).map((value, index) => ({
            value,
            name: input.categories[index] ?? '',
          })),
        },
      ],
    };
  }

  return {
    ...common,
    tooltip: { ...common.tooltip, trigger: 'axis' },
    legend: input.series.length > 1 ? { bottom: 0, textStyle: { color: muted } } : undefined,
    grid: {
      left: 8,
      right: 16,
      top: input.title ? 40 : 16,
      bottom: input.series.length > 1 ? 36 : 8,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: input.categories,
      axisLine: { lineStyle: { color: grid } },
      axisLabel: { color: muted },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: muted, formatter: (value: number) => format(value) },
      splitLine: { lineStyle: { color: grid } },
    },
    series: input.series.map((serie) => ({
      name: serie.name,
      type: input.type === 'bar' ? 'bar' : 'line',
      data: serie.data,
      smooth: input.type !== 'bar',
      showSymbol: false,
      areaStyle: input.type === 'area' ? { opacity: 0.18 } : undefined,
      barMaxWidth: 28,
      itemStyle: input.type === 'bar' ? { borderRadius: [3, 3, 0, 0] } : undefined,
    })),
  };
}
