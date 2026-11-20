import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from '@ant-design/icons';
import { Statistic, theme } from 'antd';
import type { ReactElement, ReactNode } from 'react';
import { visuallyHidden } from './shared.tsx';

export type Trend = 'up' | 'down' | 'flat';

export interface AppStatisticProps {
  title: string;
  value: number | string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  loading?: boolean;
  trend?: Trend;
}

const TREND_TEXT: Record<Trend, string> = { up: 'em alta', down: 'em queda', flat: 'estável' };

export function AppStatistic({
  title,
  value,
  prefix,
  suffix,
  precision,
  loading = false,
  trend,
}: AppStatisticProps): ReactElement {
  const { token } = theme.useToken();
  const color =
    trend === 'up' ? token.colorSuccess : trend === 'down' ? token.colorError : undefined;
  const icon =
    trend === 'up' ? (
      <ArrowUpOutlined />
    ) : trend === 'down' ? (
      <ArrowDownOutlined />
    ) : trend ? (
      <MinusOutlined />
    ) : null;
  return (
    <Statistic
      title={title}
      value={value}
      precision={precision}
      loading={loading}
      decimalSeparator=","
      groupSeparator="."
      styles={{ content: { color } }}
      prefix={
        <>
          {icon}
          {prefix}
        </>
      }
      suffix={
        <>
          {suffix}
          {trend ? <span style={visuallyHidden}>{TREND_TEXT[trend]}</span> : null}
        </>
      }
    />
  );
}
