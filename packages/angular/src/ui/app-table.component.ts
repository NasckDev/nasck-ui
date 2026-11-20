import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  formatCell,
  type ControlSize,
  type TableColumn,
  type TableRow,
} from '@nasckdev/nasck-ui-tokens';
import { AppEmptyComponent } from './app-empty.component';
import { toNzSize } from './shared';

type Cell = string | number | null | undefined;

function compare(a: Cell, b: Cell): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR');
}

@Component({
  selector: 'app-table',
  imports: [NzTableModule, AppEmptyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    tr.clickable {
      cursor: pointer;
    }
  `,
  template: `
    <nz-table
      #table
      [nzData]="data()"
      [nzLoading]="loading()"
      [nzPageSize]="pageSize()"
      [nzShowPagination]="pagination()"
      [nzHideOnSinglePage]="true"
      [nzSize]="tableSize()"
      [nzScroll]="{ x: 'max-content' }"
      [nzNoResult]="emptyTpl"
    >
      <thead>
        <tr>
          @for (column of columns(); track column.key) {
            <th
              [nzAlign]="alignOf(column)"
              [nzWidth]="column.width ? column.width + 'px' : null"
              [nzSortFn]="column.sortable ? sorter(column.key) : null"
            >
              {{ column.title }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of table.data; track row[rowKey()] ?? $index) {
          <tr
            [class.clickable]="hasRowClick"
            [attr.tabindex]="hasRowClick ? 0 : null"
            (click)="rowClick.emit(row)"
            (keydown.enter)="rowClick.emit(row)"
          >
            @for (column of columns(); track column.key) {
              <td [nzAlign]="alignOf(column)">{{ format(row, column) }}</td>
            }
          </tr>
        }
      </tbody>
    </nz-table>
    <ng-template #emptyTpl>
      <app-empty [title]="emptyText()" image="simple" />
    </ng-template>
  `,
})
export class AppTableComponent {
  readonly columns = input.required<TableColumn[]>();
  readonly data = input.required<TableRow[]>();
  readonly rowKey = input('id');
  readonly loading = input(false);
  readonly emptyText = input('Nenhum registro encontrado');
  readonly pageSize = input(10);
  readonly pagination = input(true);
  readonly size = input<ControlSize>('medium');
  /** EventEmitter (e nao output()) para saber se alguem escuta e so entao focar as linhas. */
  @Output() readonly rowClick = new EventEmitter<TableRow>();

  /** Linhas so viram clicaveis (e focaveis) quando alguem escuta o evento. */
  protected get hasRowClick(): boolean {
    return this.rowClick.observed;
  }

  protected tableSize(): 'small' | 'middle' | 'default' {
    const size = toNzSize(this.size());
    return size === 'large' ? 'default' : size === 'small' ? 'small' : 'middle';
  }

  protected alignOf(column: TableColumn): 'left' | 'center' | 'right' {
    if (column.align) return column.align;
    return column.format === 'number' || column.format === 'currency' ? 'right' : 'left';
  }

  protected sorter(key: string): (a: TableRow, b: TableRow) => number {
    return (a, b) => compare(a[key], b[key]);
  }

  protected format(row: TableRow, column: TableColumn): string {
    return formatCell(row[column.key], column.format);
  }
}
