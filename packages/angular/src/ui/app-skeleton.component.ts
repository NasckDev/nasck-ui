import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-skeleton',
  imports: [NzSkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    @if (loading()) {
      <nz-skeleton
        [nzActive]="active()"
        [nzAvatar]="avatar()"
        [nzTitle]="title()"
        [nzParagraph]="{ rows: rows() }"
      />
    } @else {
      <ng-content />
    }
  `,
})
export class AppSkeletonComponent {
  readonly loading = input(true);
  readonly rows = input(3);
  readonly avatar = input(false);
  readonly title = input(true);
  readonly active = input(true);
}
