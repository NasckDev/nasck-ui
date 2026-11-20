import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import type { ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import { FieldComponent, FormContext, iconType, nextId, toNzSize } from './shared';

export type AppInputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'textarea';

@Component({
  selector: 'app-input',
  imports: [FormsModule, NzInputModule, NzIconModule, FieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <app-field
      [controlId]="id"
      [label]="label()"
      [hint]="hint()"
      [errorMessage]="errorMessage()"
      [required]="required()"
    >
      @switch (type()) {
        @case ('textarea') {
          <textarea
            nz-input
            rows="3"
            [id]="id"
            [nzSize]="nzSize()"
            [nzStatus]="status()"
            [attr.placeholder]="placeholder()"
            [disabled]="isDisabled()"
            [required]="required()"
            [attr.aria-invalid]="errorMessage() ? 'true' : null"
            [attr.aria-describedby]="describedBy()"
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
          ></textarea>
        }
        @case ('password') {
          <nz-input-password>
            <input
              nz-input
              type="password"
              [id]="id"
              [nzSize]="nzSize()"
              [nzStatus]="status()"
              [attr.placeholder]="placeholder()"
              [disabled]="isDisabled()"
              [required]="required()"
              [attr.aria-invalid]="errorMessage() ? 'true' : null"
              [attr.aria-describedby]="describedBy()"
              [ngModel]="value()"
              (ngModelChange)="value.set($event)"
            />
          </nz-input-password>
        }
        @default {
          <nz-input-wrapper [nzAllowClear]="allowClear() && !isDisabled()">
            @if (prefixName(); as name) {
              <span nzInputPrefix><nz-icon [nzType]="name" /></span>
            }
            <input
              nz-input
              [id]="id"
              [type]="inputType()"
              [nzSize]="nzSize()"
              [nzStatus]="status()"
              [attr.placeholder]="placeholder()"
              [disabled]="isDisabled()"
              [required]="required()"
              [attr.aria-invalid]="errorMessage() ? 'true' : null"
              [attr.aria-describedby]="describedBy()"
              [attr.aria-busy]="loading() ? 'true' : null"
              [ngModel]="value()"
              (ngModelChange)="value.set($event)"
            />
            @if (loading()) {
              <span nzInputSuffix
                ><nz-icon nzType="loading" role="img" aria-label="Carregando"
              /></span>
            }
          </nz-input-wrapper>
        }
      }
    </app-field>
  `,
})
export class AppInputComponent {
  private readonly form = inject(FormContext, { optional: true });
  protected readonly id = nextId('app-input');

  readonly value = model<string>('');
  readonly type = input<AppInputType>('text');
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly hint = input<string>();
  readonly errorMessage = input<string>();
  readonly size = input<ControlSize>('medium');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly allowClear = input(false);
  readonly prefixIcon = input<IconName>();
  readonly required = input(false);

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.form?.disabled() ?? false),
  );
  protected readonly status = computed(() => (this.errorMessage() ? 'error' : ''));
  protected readonly describedBy = computed(() =>
    this.errorMessage() || this.hint() ? `${this.id}-message` : null,
  );
  protected readonly inputType = computed(() => (this.type() === 'search' ? 'text' : this.type()));
  protected readonly prefixName = computed(() => {
    const icon = this.prefixIcon() ?? (this.type() === 'search' ? 'search' : undefined);
    return icon ? iconType(icon) : null;
  });

  protected nzSize(): 'large' | 'default' | 'small' {
    return toNzSize(this.form ? this.form.size() : this.size());
  }
}
