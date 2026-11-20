import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import type { ControlSize } from '@nasckdev/nasck-ui-tokens';
import { FieldComponent, FormContext, nextId, toNzSize } from './shared';

function parseIso(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toIso(date: Date | null): string | null {
  if (!date) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

@Component({
  selector: 'app-date-picker',
  imports: [FormsModule, NzDatePickerModule, FieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    nz-date-picker {
      width: 100%;
    }
  `,
  template: `
    <app-field [controlId]="id" [label]="label()" [hint]="hint()" [errorMessage]="errorMessage()">
      <nz-date-picker
        [nzId]="id"
        nzFormat="dd/MM/yyyy"
        [nzPlaceHolder]="placeholder()"
        [nzSize]="nzSize()"
        [nzDisabled]="isDisabled()"
        [nzAllowClear]="allowClear()"
        [nzStatus]="errorMessage() ? 'error' : ''"
        [ngModel]="date()"
        (ngModelChange)="onDate($event)"
      />
    </app-field>
  `,
})
export class AppDatePickerComponent {
  private readonly form = inject(FormContext, { optional: true });
  protected readonly id = nextId('app-date');

  /** Data no formato ISO (AAAA-MM-DD). */
  readonly value = model<string | null>(null);
  readonly label = input<string>();
  readonly placeholder = input('DD/MM/AAAA');
  readonly hint = input<string>();
  readonly errorMessage = input<string>();
  readonly size = input<ControlSize>('medium');
  readonly disabled = input(false);
  readonly allowClear = input(true);

  protected readonly date = computed(() => parseIso(this.value()));
  protected readonly isDisabled = computed(
    () => this.disabled() || (this.form?.disabled() ?? false),
  );

  protected onDate(date: Date | null): void {
    this.value.set(toIso(date));
  }

  protected nzSize(): 'large' | 'default' | 'small' {
    return toNzSize(this.form ? this.form.size() : this.size());
  }
}
