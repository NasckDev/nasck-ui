import { Button, Empty } from 'antd';
import type { ReactElement } from 'react';

export interface AppEmptyProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  image?: 'default' | 'simple';
  onAction?: () => void;
}

export function AppEmpty({
  title = 'Nada por aqui ainda',
  description,
  actionLabel,
  image = 'default',
  onAction,
}: AppEmptyProps): ReactElement {
  return (
    <Empty
      image={image === 'simple' ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
      description={
        <span>
          <strong>{title}</strong>
          {description ? <span style={{ display: 'block' }}>{description}</span> : null}
        </span>
      }
    >
      {actionLabel ? (
        <Button type="primary" onClick={() => onAction?.()}>
          {actionLabel}
        </Button>
      ) : null}
    </Empty>
  );
}
