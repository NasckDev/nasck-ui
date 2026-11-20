import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import type { IconName, MenuItem } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';
import { renderIcon } from './shared.tsx';

export interface AppDropdownProps {
  items: MenuItem[];
  label: string;
  trigger?: 'click' | 'hover';
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  disabled?: boolean;
  icon?: IconName;
  onSelect?: (key: string) => void;
}

export function AppDropdown({
  items,
  label,
  trigger = 'click',
  placement = 'bottomLeft',
  disabled = false,
  icon,
  onSelect,
}: AppDropdownProps): ReactElement {
  return (
    <Dropdown
      trigger={[trigger]}
      placement={placement}
      disabled={disabled}
      menu={{
        items: items.map((item) => ({
          key: item.key,
          label: item.label,
          icon: renderIcon(item.icon),
          danger: item.danger,
          disabled: item.disabled,
        })),
        onClick: ({ key }) => onSelect?.(key),
      }}
    >
      <Button icon={renderIcon(icon)} disabled={disabled}>
        {label}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
