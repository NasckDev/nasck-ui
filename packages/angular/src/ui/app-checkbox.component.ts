import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormContext, nextId } from './shared';

@Component({
  selector: 'app-checkbox',
  imports: [NzCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      nz-checkbox
      [nzChecked]="checked()"
      [nzDisabled]="isDisabled()"
      [nzIndeterminate]="indeterminate()"
      [attr.aria-invalid]="errorMessage() ? 'true' : null"
      [attr.aria-describedby]="errorMessage() ? id + '-message' : null"
      (nzCheckedChange)="checked.set($event)"
    >
      {{ label() }}
    </label>
    @if (errorMessage()) {
      <div [id]="id + '-message'" role="alert" class="error">{{ errorMessage() }}</div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .error {
      color: var(--ant-color-error);
      font-size: 13px;
    }
  `,
})
export class AppCheckboxComponent {
  private readonly form = inject(FormContext, { optional: true });
  protected readonly id = nextId('app-checkbox');

  readonly checked = model(false);
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly indeterminate = input(false);
  readonly errorMessage = input<string>();

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.form?.disabled() ?? false),
  );
}
