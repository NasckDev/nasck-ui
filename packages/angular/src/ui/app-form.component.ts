import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import type { ControlSize } from '@nasckdev/nasck-ui-tokens';
import { FormContext, nextId } from './shared';

@Component({
  selector: 'app-form',
  imports: [NzFormModule],
  providers: [FormContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    fieldset {
      border: 0;
      margin: 0;
      padding: 0;
      min-width: 0;
      display: grid;
      gap: 16px;
    }
    fieldset.inline {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  `,
  template: `
    <form nz-form [nzLayout]="layout()" novalidate (ngSubmit)="submitted.emit()">
      <fieldset [disabled]="disabled()" [class.inline]="layout() === 'inline'">
        <ng-content />
      </fieldset>
    </form>
  `,
})
export class AppFormComponent {
  private readonly context = inject(FormContext);

  readonly layout = input<'vertical' | 'horizontal' | 'inline'>('vertical');
  readonly disabled = input(false);
  readonly size = input<ControlSize>('medium');
  readonly submitted = output<void>();

  constructor() {
    effect(() => {
      this.context.size.set(this.size());
      this.context.disabled.set(this.disabled());
    });
  }
}

@Component({
  selector: 'app-form-item',
  imports: [NzFormModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-form-item>
      @if (label()) {
        <nz-form-label [nzRequired]="required()">
          <span [id]="labelId">{{ label() }}</span>
        </nz-form-label>
      }
      <nz-form-control
        [nzExtra]="hint()"
        [nzErrorTip]="errorMessage()"
        [nzValidateStatus]="errorMessage() ? 'error' : ''"
      >
        <div role="group" [attr.aria-labelledby]="label() ? labelId : null">
          <ng-content />
        </div>
      </nz-form-control>
    </nz-form-item>
  `,
})
export class AppFormItemComponent {
  protected readonly labelId = nextId('app-form-item');

  readonly label = input<string>();
  readonly hint = input<string>();
  readonly errorMessage = input<string>();
  readonly required = input(false);
}
