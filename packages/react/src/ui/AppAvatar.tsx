import { Avatar, theme } from 'antd';
import type { IconName } from '@nasckdev/nasck-ui-tokens';
import type { ReactElement } from 'react';
import { renderIcon } from './shared.tsx';

export interface AppAvatarProps {
  src?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  icon?: IconName;
}

export function initials(name: string | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export function AppAvatar({
  src,
  name,
  size = 'medium',
  shape = 'circle',
  icon,
}: AppAvatarProps): ReactElement {
  const { token } = theme.useToken();
  return (
    <span role={name ? 'img' : undefined} aria-label={name} style={{ display: 'inline-flex' }}>
      <Avatar
        src={src}
        alt={name ?? ''}
        size={size === 'medium' ? 'default' : size}
        shape={shape}
        style={{ background: token.colorPrimaryBg, color: token.colorLink }}
        icon={!src && !name ? renderIcon(icon ?? 'user') : undefined}
      >
        {!src ? initials(name) : null}
      </Avatar>
    </span>
  );
}
