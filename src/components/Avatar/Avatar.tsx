import { useState, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Full name: used for the accessible name and to derive initials and color. */
  name: string;
  /** Image URL. Falls back to initials when missing or when it fails to load. */
  src?: string;
  size?: AvatarSize;
}

const TONE_COUNT = 5;

/** Up to two initials from the first and last words of a name. */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
};

/** Stable tone index for a name, so the same person always gets the same color. */
export const getToneIndex = (name: string): number => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % TONE_COUNT;
};

/** Photo or colored initials. The container is an image with the person's name as its label. */
export function Avatar({ name, src, size = 'md', className, ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      {...rest}
      role="img"
      aria-label={name}
      className={cx('nui-avatar', className)}
      data-size={size}
      data-tone={getToneIndex(name)}
    >
      {showImage ? (
        <img src={src} alt="" className="nui-avatar__image" onError={() => setFailedSrc(src ?? null)} />
      ) : (
        <span className="nui-avatar__initials" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Accessible name of the group, e.g. "Responsáveis". */
  label: string;
  people: ReadonlyArray<{ name: string; src?: string }>;
  /** How many avatars are shown before the "+N" counter. */
  max?: number;
  size?: AvatarSize;
  className?: string;
}

/** Overlapping avatars with a counter for the rest. The list is announced as a group. */
export function AvatarGroup({ label, people, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = people.slice(0, max);
  const hidden = people.length - visible.length;

  return (
    <span role="group" aria-label={label} className={cx('nui-avatar-group', className)}>
      {visible.map((person) => (
        <Avatar key={person.name} name={person.name} src={person.src} size={size} />
      ))}
      {hidden > 0 ? (
        <span role="img" aria-label={`mais ${hidden}`}
          className="nui-avatar nui-avatar--count"
          data-size={size}
        >
          <span aria-hidden="true" className="nui-avatar__initials">
            +{hidden}
          </span>
        </span>
      ) : null}
    </span>
  );
}
