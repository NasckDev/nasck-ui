import { ChangeDetectionStrategy, Component, Injectable, input, signal } from '@angular/core';
import type { ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';

let sequence = 0;
/** Id unico e estavel por instancia, usado para ligar rotulo, ajuda e erro ao controle. */
export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

export type NzSizeName = 'large' | 'default' | 'small';

export function toNzSize(size: ControlSize | undefined): NzSizeName {
  if (size === 'small') return 'small';
  if (size === 'large') return 'large';
  return 'default';
}

const ICON_TYPES: Record<IconName, string> = {
  plus: 'plus',
  search: 'search',
  delete: 'delete',
  edit: 'edit',
  download: 'download',
  upload: 'upload',
  check: 'check',
  close: 'close',
  user: 'user',
  setting: 'setting',
  bell: 'bell',
  info: 'info-circle',
  warning: 'warning',
  mail: 'mail',
  calendar: 'calendar',
  filter: 'filter',
  reload: 'reload',
  more: 'more',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  home: 'home',
  eye: 'eye',
};

/** Nome do icone no NG-ZORRO para um nome do contrato. */
export function iconType(name: IconName): string {
  return ICON_TYPES[name];
}

/** Contexto que o AppForm entrega aos campos filhos (tamanho e desabilitado). */
@Injectable()
export class FormContext {
  readonly size = signal<ControlSize>('medium');
  readonly disabled = signal(false);
}

/** Rotulo, ajuda e mensagem de erro de um campo (uso interno dos wrappers). */
@Component({
  selector: 'app-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-field">
      @if (label()) {
        <label [attr.for]="controlId()" class="app-field__label">
          {{ label() }}
          @if (required()) {
            <span aria-hidden="true" class="app-field__required"> *</span>
          }
        </label>
      }
      <ng-content />
      @if (errorMessage()) {
        <div [id]="controlId() + '-message'" role="alert" class="app-field__error">
          {{ errorMessage() }}
        </div>
      } @else if (hint()) {
        <div [id]="controlId() + '-message'" class="app-field__hint">{{ hint() }}</div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .app-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .app-field__label {
      font-weight: 500;
      color: var(--ant-color-text);
    }
    .app-field__required,
    .app-field__error {
      color: var(--ant-color-error);
    }
    .app-field__hint,
    .app-field__error {
      font-size: 13px;
    }
    .app-field__hint {
      color: var(--ant-color-text-description);
    }
  `,
})
export class FieldComponent {
  readonly controlId = input.required<string>();
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly errorMessage = input<string>();
  readonly required = input(false);
}

export const SR_ONLY_STYLE = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
`;
