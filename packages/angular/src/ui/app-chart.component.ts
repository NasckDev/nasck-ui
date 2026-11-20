import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import {
  buildChartOption,
  formatValue,
  type ChartSeries,
  type ChartType,
  type ValueFormat,
} from '@nasckdev/nasck-ui-tokens';
import { AppEmptyComponent } from './app-empty.component';
import { SR_ONLY_STYLE } from './shared';
import { NasckThemeService } from './theme';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  AriaComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-chart',
  imports: [NgxEchartsDirective, NzSkeletonModule, AppEmptyComponent],
  providers: [provideEchartsCore({ echarts })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: [
    SR_ONLY_STYLE,
    `
      :host {
        display: block;
      }
      figure {
        margin: 0;
        position: relative;
      }
    `,
  ],
  template: `
    @if (loading()) {
      <nz-skeleton [nzActive]="true" [nzTitle]="false" [nzParagraph]="{ rows: 5 }" />
    } @else if (!hasData()) {
      <app-empty [title]="emptyText()" image="simple" />
    } @else {
      <figure [attr.aria-label]="description()">
        <div role="img" [attr.aria-label]="description()">
          <div echarts [options]="option()" [style.height.px]="height()" style="width: 100%"></div>
        </div>
        <table class="sr-only">
          <caption>
            {{
              description()
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col">Categoria</th>
              @for (serie of series(); track serie.name) {
                <th scope="col">{{ serie.name }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (category of categories(); track category; let i = $index) {
              <tr>
                <th scope="row">{{ category }}</th>
                @for (serie of series(); track serie.name) {
                  <td>{{ format(serie.data[i] ?? 0) }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </figure>
    }
  `,
})
export class AppChartComponent {
  private readonly theme = inject(NasckThemeService);

  readonly type = input<ChartType>('line');
  readonly categories = input.required<string[]>();
  readonly series = input.required<ChartSeries[]>();
  readonly title = input<string>();
  readonly height = input(280);
  readonly loading = input(false);
  readonly emptyText = input('Sem dados para exibir');
  readonly ariaLabel = input<string>();
  readonly valueFormat = input<ValueFormat>('number');

  protected readonly hasData = computed(() => this.series().some((serie) => serie.data.length > 0));
  protected readonly description = computed(() => this.ariaLabel() ?? this.title() ?? 'Gráfico');
  protected readonly option = computed(() =>
    buildChartOption(
      {
        type: this.type(),
        categories: this.categories(),
        series: this.series(),
        title: this.title(),
        valueFormat: this.valueFormat(),
        ariaLabel: this.ariaLabel(),
      },
      this.theme.tokens(),
    ),
  );

  protected format(value: number): string {
    return formatValue(value, this.valueFormat());
  }
}
