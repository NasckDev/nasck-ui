import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { Skeleton, theme } from 'antd';
import {
  buildChartOption,
  formatValue,
  type ChartSeries,
  type ChartType,
  type ResolvedTokens,
  type ValueFormat,
} from '@nasckdev/nasck-ui-tokens';
import { useMemo, type ReactElement } from 'react';
import { AppEmpty } from './AppEmpty.tsx';
import { visuallyHidden } from './shared.tsx';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  AriaComponent,
  CanvasRenderer,
]);

export interface AppChartProps {
  type?: ChartType;
  categories: string[];
  series: ChartSeries[];
  title?: string;
  height?: number;
  loading?: boolean;
  emptyText?: string;
  ariaLabel?: string;
  valueFormat?: ValueFormat;
}

function toResolved(token: object): ResolvedTokens {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(token)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      out[key] = value;
    }
  }
  return out;
}

export function AppChart({
  type = 'line',
  categories,
  series,
  title,
  height = 280,
  loading = false,
  emptyText = 'Sem dados para exibir',
  ariaLabel,
  valueFormat = 'number',
}: AppChartProps): ReactElement {
  const { token } = theme.useToken();
  const option = useMemo(
    () =>
      buildChartOption(
        { type, categories, series, title, valueFormat, ariaLabel },
        toResolved(token),
      ),
    [type, categories, series, title, valueFormat, ariaLabel, token],
  );
  const hasData = series.some((serie) => serie.data.length > 0);

  if (loading) return <Skeleton active paragraph={{ rows: 5 }} title={false} />;
  if (!hasData) return <AppEmpty title={emptyText} image="simple" />;

  const description = ariaLabel ?? title ?? 'Gráfico';
  return (
    <figure style={{ margin: 0, position: 'relative' }} aria-label={description}>
      <div role="img" aria-label={description}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          notMerge
          style={{ height, width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
      <table style={visuallyHidden}>
        <caption>{description}</caption>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            {series.map((serie) => (
              <th scope="col" key={serie.name}>
                {serie.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category}>
              <th scope="row">{category}</th>
              {series.map((serie) => (
                <td key={serie.name}>{formatValue(serie.data[index] ?? 0, valueFormat)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
