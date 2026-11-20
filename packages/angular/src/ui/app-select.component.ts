import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import type { ControlSize, SelectOption } from '@nasckdev/nasck-ui-tokens';
import { FieldComponent, FormContext, nextId, toNzSize } from './shared';

@Component({
  selector: 'app-select',
  imports: [FormsModule, NzSelectModule, FieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    nz-select {
      width: 100%;
    }
  `,
  template: `
    <app-field [controlId]="id" [label]="label()" [hint]="hint()" [errorMessage]="errorMessage()">
      <nz-select
        [nzId]="id"
        [nzOptions]="options()"
        [nzPlaceHolder]="placeholder() ?? ''"
        [nzSize]="nzSize()"
        [nzDisabled]="isDisabled()"
        [nzLoading]="loading()"
        [nzShowSearch]="searchable()"
        [nzMode]="multiple() ? 'multiple' : 'default'"
        [nzAllowClear]="allowClear()"
        [nzStatus]="errorMessage() ? 'error' : ''"
        [nzNotFoundContent]="emptyText()"
        [ngModel]="value()"
        (ngModelChange)="value.set($event)"
        (nzOnSearch)="searched.emit($event)"
      />
    </app-field>
  `,
})
export class AppSelectComponent {
  private readonly form = inject(FormContext, { optional: true });
  protected readonly id = nextId('app-select');

  readonly value = model<string | string[] | null>(null);
  readonly options = input.required<SelectOption[]>();
  readonly placeholder = input<string>();
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly errorMessage = input<string>();
  readonly size = input<ControlSize>('medium');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly searchable = input(false);
  readonly multiple = input(false);
  readonly allowClear = input(false);
  readonly emptyText = input('Nenhuma opção encontrada');
  readonly searched = output<string>();

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.form?.disabled() ?? false),
  );

  protected nzSize(): 'large' | 'default' | 'small' {
    return toNzSize(this.form ? this.form.size() : this.size());
  }
}
