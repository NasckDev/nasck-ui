import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import type { ButtonVariant, ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import { iconType, toNzSize } from './shared';

@Component({
  selector: 'app-icon-button',
  imports: [NzButtonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    <button
      nz-button
      nzShape="circle"
      [nzType]="variant()"
      [nzSize]="nzSize()"
      [nzLoading]="false"
      [attr.aria-busy]="loading() ? 'true' : null"
      [style.pointer-events]="loading() ? 'none' : null"
      [disabled]="disabled()"
      [nzDanger]="danger()"
      [attr.aria-label]="label()"
      [attr.title]="label()"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <nz-icon nzType="loading" [nzSpin]="true" />
      } @else {
        <nz-icon [nzType]="iconName()" />
      }
    </button>
  `,
})
export class AppIconButtonComponent {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly variant = input<ButtonVariant>('text');
  readonly size = input<ControlSize>('medium');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly danger = input(false);
  readonly clicked = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    if (!this.loading()) this.clicked.emit(event);
  }

  protected nzSize(): 'large' | 'default' | 'small' {
    return toNzSize(this.size());
  }

  protected iconName(): string {
    return iconType(this.icon());
  }
}
