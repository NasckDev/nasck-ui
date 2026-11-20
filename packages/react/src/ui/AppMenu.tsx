import { Menu } from 'antd';
import type { MenuItem } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';
import { renderIcon } from './shared.tsx';

export interface AppMenuProps {
  items: MenuItem[];
  selectedKey?: string;
  mode?: 'inline' | 'horizontal' | 'vertical';
  collapsed?: boolean;
  onSelect?: (key: string) => void;
}

export function AppMenu({
  items,
  selectedKey,
  mode = 'inline',
  collapsed = false,
  onSelect,
}: AppMenuProps): ReactElement {
  return (
    <Menu
      mode={mode}
      inlineCollapsed={mode === 'inline' ? collapsed : undefined}
      selectedKeys={selectedKey ? [selectedKey] : []}
      items={items.map((item) => ({
        key: item.key,
        label: item.label,
        icon: renderIcon(item.icon),
        disabled: item.disabled,
        danger: item.danger,
      }))}
      onClick={({ key }) => onSelect?.(key)}
    />
  );
}
