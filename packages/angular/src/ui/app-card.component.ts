import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-card',
  imports: [NzCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-card
      [nzTitle]="title()"
      [nzExtra]="extra()"
      [nzLoading]="loading()"
      [nzBordered]="bordered()"
      [nzHoverable]="hoverable()"
      [nzSize]="size()"
    >
      <ng-content />
    </nz-card>
  `,
})
export class AppCardComponent {
  readonly title = input<string>();
  readonly extra = input<string>();
  readonly loading = input(false);
  readonly bordered = input(true);
  readonly hoverable = input(false);
  readonly size = input<'default' | 'small'>('default');
}
