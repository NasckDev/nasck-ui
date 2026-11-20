import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import type { StepItem } from '@nasckdev/nasck-ui-tokens';

@Component({
  selector: 'app-steps',
  imports: [NzStepsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-steps
      [nzCurrent]="current()"
      [nzDirection]="direction()"
      [nzSize]="size() === 'small' ? 'small' : 'default'"
    >
      @for (item of items(); track item.title) {
        <nz-step
          [nzTitle]="item.title"
          [nzDescription]="item.description ?? ''"
          [nzStatus]="item.status ?? ''"
        />
      }
    </nz-steps>
  `,
})
export class AppStepsComponent {
  readonly items = input.required<StepItem[]>();
  readonly current = input(0);
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
  readonly size = input<'small' | 'medium'>('medium');
}
