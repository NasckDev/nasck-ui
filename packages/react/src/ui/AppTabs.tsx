import { Tabs } from 'antd';
import type { TabItem } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement, ReactNode } from 'react';

export interface AppTabsProps {
  items: TabItem[];
  activeKey?: string;
  type?: 'line' | 'card';
  size?: 'small' | 'medium' | 'large';
  onChange?: (key: string) => void;
  children?: ReactNode;
}

export function AppTabs({
  items,
  activeKey,
  type = 'line',
  size = 'medium',
  onChange,
  children,
}: AppTabsProps): ReactElement {
  return (
    <div>
      <Tabs
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          disabled: item.disabled,
          children: item.content,
        }))}
        activeKey={activeKey}
        type={type}
        size={size === 'medium' ? 'middle' : size}
        onChange={(key) => onChange?.(key)}
      />
      {children}
    </div>
  );
}
