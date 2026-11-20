import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import type { Tone } from '@nasckdev/nasck-ui-tokens';

@Component({
  selector: 'app-alert',
  imports: [NzAlertModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-alert
      [nzType]="type()"
      [nzMessage]="title()"
      [nzDescription]="description() ?? null"
      [nzCloseable]="closable()"
      [nzShowIcon]="showIcon()"
      [nzBanner]="banner()"
      (nzOnClose)="closed.emit()"
    />
  `,
})
export class AppAlertComponent {
  readonly type = input<Tone>('info');
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly closable = input(false);
  readonly showIcon = input(true);
  readonly banner = input(false);
  readonly closed = output<void>();
}
