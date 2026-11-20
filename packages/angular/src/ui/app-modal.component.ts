import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal',
  imports: [NzModalModule, NzButtonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
  template: `
    <nz-modal
      [nzVisible]="open()"
      [nzTitle]="title()"
      [nzFooter]="footer"
      [nzWidth]="width()"
      [nzClosable]="closable()"
      (nzOnCancel)="cancelled.emit()"
    >
      <ng-container *nzModalContent>
        <ng-content />
      </ng-container>
    </nz-modal>
    <ng-template #footer>
      <button nz-button nzType="default" type="button" (click)="cancelled.emit()">
        {{ cancelText() }}
      </button>
      <button
        nz-button
        nzType="primary"
        type="button"
        [nzDanger]="danger()"
        [attr.aria-busy]="loading() ? 'true' : null"
        [style.pointer-events]="loading() ? 'none' : null"
        (click)="confirmed.emit()"
      >
        @if (loading()) {
          <nz-icon nzType="loading" [nzSpin]="true" />
        }
        {{ okText() }}
      </button>
    </ng-template>
  `,
})
export class AppModalComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly okText = input('Confirmar');
  readonly cancelText = input('Cancelar');
  readonly loading = input(false);
  readonly danger = input(false);
  readonly width = input(520);
  readonly closable = input(true);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
