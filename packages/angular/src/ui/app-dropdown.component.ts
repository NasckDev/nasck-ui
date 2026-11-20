import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import type { IconName, MenuItem } from '@nasckdev/nasck-ui-tokens';
import { iconType } from './shared';

@Component({
  selector: 'app-dropdown',
  imports: [NzButtonModule, NzDropdownModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    <button
      nz-button
      nz-dropdown
      type="button"
      [nzDropdownMenu]="menu"
      [nzTrigger]="trigger()"
      [nzPlacement]="placement()"
      [disabled]="disabled()"
    >
      @if (icon(); as name) {
        <nz-icon [nzType]="iconName(name)" />
      }
      {{ label() }}
      <nz-icon nzType="down" />
    </button>
    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        @for (item of items(); track item.key) {
          <li
            nz-menu-item
            [nzDanger]="item.danger ?? false"
            [nzDisabled]="item.disabled ?? false"
            (click)="selected.emit(item.key)"
          >
            @if (item.icon) {
              <nz-icon [nzType]="iconName(item.icon)" />
            }
            {{ item.label }}
          </li>
        }
      </ul>
    </nz-dropdown-menu>
  `,
})
export class AppDropdownComponent {
  readonly items = input.required<MenuItem[]>();
  readonly label = input.required<string>();
  readonly trigger = input<'click' | 'hover'>('click');
  readonly placement = input<'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'>('bottomLeft');
  readonly disabled = input(false);
  readonly icon = input<IconName>();
  readonly selected = output<string>();

  protected iconName(name: IconName): string {
    return iconType(name);
  }
}
