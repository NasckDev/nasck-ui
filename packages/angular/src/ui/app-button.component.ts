import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import type { ButtonVariant, ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import { iconType, toNzSize } from './shared';

@Component({
  selector: 'app-button',
  imports: [NzButtonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.display]': "block() ? 'block' : 'inline-block'" },
  template: `
    <button
      nz-button
      [nzType]="variant()"
      [nzSize]="nzSize()"
      [nzLoading]="false"
      [attr.aria-busy]="loading() ? 'true' : null"
      [style.pointer-events]="loading() ? 'none' : null"
      [disabled]="disabled()"
      [nzDanger]="danger()"
      [nzBlock]="block()"
      [attr.type]="htmlType()"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <nz-icon nzType="loading" [nzSpin]="true" />
      } @else if (icon(); as name) {
        <nz-icon [nzType]="iconName(name)" />
      }
      <ng-content />
    </button>
  `,
})
export class AppButtonComponent {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ControlSize>('medium');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly icon = input<IconName>();
  readonly danger = input(false);
  readonly block = input(false);
  readonly htmlType = input<'button' | 'submit' | 'reset'>('button');
  readonly clicked = output<MouseEvent>();

  /** Sem a prop de loading do NG-ZORRO: a camada translucida dela derruba o contraste do texto. */
  protected onClick(event: MouseEvent): void {
    if (!this.loading()) this.clicked.emit(event);
  }

  protected nzSize(): 'large' | 'default' | 'small' {
    return toNzSize(this.size());
  }

  protected iconName(name: IconName): string {
    return iconType(name);
  }
}
