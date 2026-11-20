import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import type { IconName, MenuItem } from '@nasckdev/nasck-ui-tokens';
import { iconType } from './shared';

@Component({
  selector: 'app-menu',
  imports: [NzMenuModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ul
      nz-menu
      [nzMode]="mode()"
      [nzInlineCollapsed]="mode() === 'inline' && collapsed()"
      [nzSelectable]="true"
    >
      @for (item of items(); track item.key) {
        <li
          nz-menu-item
          [nzSelected]="item.key === selectedKey()"
          [nzDisabled]="item.disabled ?? false"
          [nzDanger]="item.danger ?? false"
          [attr.aria-current]="item.key === selectedKey() ? 'page' : null"
          (click)="selected.emit(item.key)"
        >
          @if (item.icon) {
            <nz-icon [nzType]="iconName(item.icon)" />
          }
          <span>{{ item.label }}</span>
        </li>
      }
    </ul>
  `,
})
export class AppMenuComponent {
  readonly items = input.required<MenuItem[]>();
  readonly selectedKey = input<string>();
  readonly mode = input<'inline' | 'horizontal' | 'vertical'>('inline');
  readonly collapsed = input(false);
  readonly selected = output<string>();

  protected iconName(name: IconName): string {
    return iconType(name);
  }
}
