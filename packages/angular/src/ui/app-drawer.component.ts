import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-drawer',
  imports: [NzDrawerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  template: `
    <nz-drawer
      [nzVisible]="open()"
      [nzTitle]="title()"
      [nzPlacement]="placement()"
      [nzWidth]="width()"
      [nzHeight]="width()"
      [nzClosable]="closable()"
      (nzOnClose)="closed.emit()"
    >
      <ng-container *nzDrawerContent>
        <ng-content />
      </ng-container>
    </nz-drawer>
  `,
})
export class AppDrawerComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly placement = input<'left' | 'right' | 'top' | 'bottom'>('right');
  readonly width = input(420);
  readonly closable = input(true);
  readonly closed = output<void>();
}
