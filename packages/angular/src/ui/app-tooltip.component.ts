import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-tooltip',
  imports: [NzTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block', '[attr.title]': 'null' },
  template: `
    <span nz-tooltip [nzTooltipTitle]="title()" [nzTooltipPlacement]="placement()" class="trigger">
      <ng-content />
    </span>
  `,
  styles: `
    .trigger {
      display: inline-flex;
    }
  `,
})
export class AppTooltipComponent {
  readonly title = input.required<string>();
  readonly placement = input<'top' | 'bottom' | 'left' | 'right'>('top');
}
