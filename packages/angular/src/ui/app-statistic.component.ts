import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { SR_ONLY_STYLE } from './shared';

const TREND_TEXT = { up: 'em alta', down: 'em queda', flat: 'estável' } as const;

@Component({
  selector: 'app-statistic',
  imports: [NzIconModule, NzSkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: [
    SR_ONLY_STYLE,
    `
      :host {
        display: block;
      }
      .title {
        color: var(--ant-color-text-description);
        font-size: 14px;
        margin-bottom: 4px;
      }
      .value {
        font-size: 24px;
        font-family: var(--ant-font-family-heading, inherit);
        font-variant-numeric: tabular-nums;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .value.up {
        color: var(--ant-color-success);
      }
      .value.down {
        color: var(--ant-color-error);
      }
    `,
  ],
  template: `
    <div class="title">{{ title() }}</div>
    @if (loading()) {
      <nz-skeleton [nzActive]="true" [nzTitle]="false" [nzParagraph]="{ rows: 1 }" />
    } @else {
      <div class="value" [class.up]="trend() === 'up'" [class.down]="trend() === 'down'">
        @if (trend() === 'up') {
          <nz-icon nzType="arrow-up" aria-hidden="true" />
        } @else if (trend() === 'down') {
          <nz-icon nzType="arrow-down" aria-hidden="true" />
        }
        @if (prefix()) {
          <span>{{ prefix() }}</span>
        }
        <span>{{ formatted() }}</span>
        @if (suffix()) {
          <span>{{ suffix() }}</span>
        }
        @if (trend(); as t) {
          <span class="sr-only">{{ trendText(t) }}</span>
        }
      </div>
    }
  `,
})
export class AppStatisticComponent {
  readonly title = input.required<string>();
  readonly value = input.required<number | string>();
  readonly prefix = input<string>();
  readonly suffix = input<string>();
  readonly precision = input<number>();
  readonly loading = input(false);
  readonly trend = input<'up' | 'down' | 'flat'>();

  protected readonly formatted = computed(() => {
    const value = this.value();
    if (typeof value === 'string') return value;
    const digits = this.precision();
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  });

  protected trendText(trend: 'up' | 'down' | 'flat'): string {
    return TREND_TEXT[trend];
  }
}
