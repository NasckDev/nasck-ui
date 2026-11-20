import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormContext, nextId } from './shared';

@Component({
  selector: 'app-switch',
  imports: [FormsModule, NzSwitchModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: inline-block' },
  template: `
    <span class="row">
      <nz-switch
        [ngModel]="checked()"
        [nzDisabled]="isDisabled()"
        [nzLoading]="loading()"
        [nzSize]="size() === 'small' ? 'small' : 'default'"
        (ngModelChange)="checked.set($event)"
      />
      <span [id]="id">{{ label() }}</span>
    </span>
  `,
  styles: `
    .row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class AppSwitchComponent {
  private readonly form = inject(FormContext, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly id = nextId('app-switch');

  readonly checked = model(false);
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly size = input<'small' | 'medium'>('medium');

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.form?.disabled() ?? false),
  );

  constructor() {
    // O botao interno do NG-ZORRO nao tem nome acessivel: ligamos ao texto visivel.
    afterNextRender(() => {
      this.host.nativeElement.querySelector('button')?.setAttribute('aria-labelledby', this.id);
    });
  }
}
