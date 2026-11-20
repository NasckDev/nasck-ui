import type { MONTHS } from './dashboardData';

export function RevenueChart({ data }: { data: typeof MONTHS }) {
  const max = Math.max(...data.map((month) => month.value));
  const step = 288 / data.length;
  const barWidth = Math.min(30, step * 0.62);
  return (
    <figure className="tpl-chart">
      <figcaption className="tpl-chart__caption">Receita por mês (R$ mil)</figcaption>
      <svg
        viewBox="0 0 300 140"
        className="tpl-chart__svg"
        role="img"
        aria-label={`Gráfico de barras da receita: ${data.map((m) => `${m.label} ${m.value} mil`).join(', ')}.`}
      >
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="0"
            x2="300"
            y1={20 + line * 30}
            y2={20 + line * 30}
            className="tpl-chart__grid"
          />
        ))}
        {data.map((month, index) => {
          const height = (month.value / max) * 100;
          const last = index === data.length - 1;
          const x = 6 + index * step + (step - barWidth) / 2;
          return (
            <g key={month.label}>
              <rect
                x={x}
                y={120 - height}
                width={barWidth}
                height={height}
                rx="2"
                className={last ? 'tpl-chart__bar tpl-chart__bar--now' : 'tpl-chart__bar'}
                style={{ animationDelay: `${index * 20}ms` }}
              />
              <text x={x + barWidth / 2} y="136" textAnchor="middle" className="tpl-chart__label">
                {month.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
