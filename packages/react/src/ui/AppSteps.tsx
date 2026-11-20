import { Steps } from 'antd';
import type { StepItem } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';

export interface AppStepsProps {
  items: StepItem[];
  current?: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium';
}

const STATUS = { wait: 'wait', process: 'process', finish: 'finish', error: 'error' } as const;

export function AppSteps({
  items,
  current = 0,
  direction = 'horizontal',
  size = 'medium',
}: AppStepsProps): ReactElement {
  return (
    <Steps
      current={current}
      orientation={direction}
      size={size === 'small' ? 'small' : 'default'}
      items={items.map((item) => ({
        title: item.title,
        content: item.description,
        status: item.status ? STATUS[item.status] : undefined,
      }))}
    />
  );
}
