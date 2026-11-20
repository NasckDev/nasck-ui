import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import type { IconName } from '@nasckdev/nasck-ui-tokens';
import { iconType } from './shared';

export function initials(name: string | undefined): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

@Component({
  selector: 'app-avatar',
  imports: [NzAvatarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: inline-flex',
    '[attr.role]': "name() ? 'img' : null",
    '[attr.aria-label]': 'name() ?? null',
  },
  template: `
    <nz-avatar
      [nzSrc]="src()"
      [nzText]="text()"
      [nzIcon]="showIcon() ? iconName() : ''"
      [nzSize]="nzSize()"
      [nzShape]="shape()"
      [nzAlt]="name() ?? ''"
    />
  `,
})
export class AppAvatarComponent {
  readonly src = input<string>();
  readonly name = input<string>();
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly shape = input<'circle' | 'square'>('circle');
  readonly icon = input<IconName>();

  protected readonly text = computed(() => (this.src() ? '' : initials(this.name())));
  protected readonly showIcon = computed(() => !this.src() && !this.name());
  protected iconName(): string {
    return iconType(this.icon() ?? 'user');
  }

  protected nzSize(): 'small' | 'default' | 'large' {
    return this.size() === 'medium' ? 'default' : (this.size() as 'small' | 'large');
  }
}
