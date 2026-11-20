import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-empty',
  imports: [NzEmptyModule, NzButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  styles: `
    :host {
      display: block;
    }
    .description {
      display: block;
    }
  `,
  template: `
    <nz-empty
      [nzNotFoundImage]="image() === 'simple' ? 'simple' : 'default'"
      [nzNotFoundContent]="content"
      [nzNotFoundFooter]="actionLabel() ? footer : undefined"
    />
    <ng-template #content>
      <strong>{{ title() }}</strong>
      @if (description()) {
        <span class="description">{{ description() }}</span>
      }
    </ng-template>
    <ng-template #footer>
      <button nz-button nzType="primary" type="button" (click)="action.emit()">
        {{ actionLabel() }}
      </button>
    </ng-template>
  `,
})
export class AppEmptyComponent {
  readonly title = input('Nada por aqui ainda');
  readonly description = input<string>();
  readonly actionLabel = input<string>();
  readonly image = input<'default' | 'simple'>('default');
  readonly action = output<void>();
}
