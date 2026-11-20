import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterEveryRender,
  inject,
  input,
  output,
} from '@angular/core';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

export interface PageChange {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  imports: [NzPaginationModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-pagination
      [nzPageIndex]="current()"
      [nzTotal]="total()"
      [nzPageSize]="pageSize()"
      [nzShowSizeChanger]="showSizeChanger()"
      [nzSimple]="simple()"
      [nzDisabled]="disabled()"
      [nzShowTotal]="totalTpl"
      (nzPageIndexChange)="pageChange.emit({ page: $event, pageSize: pageSize() })"
      (nzPageSizeChange)="pageChange.emit({ page: 1, pageSize: $event })"
    />
    <ng-template #totalTpl let-total let-range="range"
      >{{ range[0] }}-{{ range[1] }} de {{ total }}</ng-template
    >
  `,
})
export class AppPaginationComponent {
  readonly current = input(1);
  readonly total = input.required<number>();
  readonly pageSize = input(10);
  readonly showSizeChanger = input(false);
  readonly simple = input(false);
  readonly disabled = input(false);
  readonly pageChange = output<PageChange>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Os campos internos do NG-ZORRO (pagina atual e tamanho da pagina) nascem sem rotulo.
    afterEveryRender(() => {
      const root = this.host.nativeElement;
      const label = (selector: string, text: string): void => {
        root.querySelectorAll(selector).forEach((input) => {
          if (!input.hasAttribute('aria-label')) input.setAttribute('aria-label', text);
        });
      };
      label('.ant-pagination-simple-pager input', 'Página atual');
      label('.ant-pagination-options input', 'Itens por página');
    });
  }
}
