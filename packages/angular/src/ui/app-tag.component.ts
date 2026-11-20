import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { iconType } from './shared';
import type { IconName, TagColor } from '@nasckdev/nasck-ui-tokens';

@Component({
  selector: 'app-tag',
  imports: [NzTagModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    <nz-tag
      [nzColor]="nzColor()"
      [nzBordered]="bordered()"
      [nzMode]="closable() ? 'closeable' : 'default'"
      (nzOnClose)="closed.emit()"
    >
      @if (icon(); as name) {
        <nz-icon [nzType]="iconName(name)" />
      }
      {{ label() }}
    </nz-tag>
  `,
})
export class AppTagComponent {
  readonly label = input.required<string>();
  readonly color = input<TagColor>('default');
  readonly icon = input<IconName>();
  readonly closable = input(false);
  readonly bordered = input(true);
  readonly closed = output<void>();

  protected nzColor(): string {
    const color = this.color();
    return color === 'info' ? 'processing' : color;
  }

  protected iconName(name: IconName): string {
    return iconType(name);
  }
}

export type StatusKind = 'success' | 'warning' | 'error' | 'info' | 'processing' | 'default';

/** Ponto colorido mais texto: a cor nunca e o unico sinal. */
@Component({
  selector: 'app-status',
  imports: [NzBadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    @if (status() === 'info') {
      <nz-badge nzColor="var(--ant-color-info)" [nzText]="label()" />
    } @else {
      <nz-badge [nzStatus]="nzStatus()" [nzText]="label()" />
    }
  `,
})
export class AppStatusComponent {
  readonly status = input.required<StatusKind>();
  readonly label = input.required<string>();

  protected nzStatus(): 'success' | 'warning' | 'error' | 'processing' | 'default' {
    const status = this.status();
    return status === 'info' ? 'default' : status;
  }
}
