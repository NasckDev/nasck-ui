import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import type { TabItem } from '@nasckdev/nasck-ui-tokens';

@Component({
  selector: 'app-tabs',
  imports: [NzTabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <nz-tabs
      [nzSelectedIndex]="selectedIndex()"
      [nzType]="type()"
      [nzSize]="nzSize()"
      (nzSelectedIndexChange)="onIndex($event)"
    >
      @for (item of items(); track item.key) {
        <nz-tab [nzTitle]="item.label" [nzDisabled]="item.disabled ?? false">
          <ng-template nz-tab>{{ item.content }}</ng-template>
        </nz-tab>
      }
    </nz-tabs>
    <ng-content />
  `,
})
export class AppTabsComponent {
  readonly items = input.required<TabItem[]>();
  readonly activeKey = model<string>();
  readonly type = input<'line' | 'card'>('line');
  readonly size = input<'small' | 'medium' | 'large'>('medium');

  protected readonly selectedIndex = computed(() => {
    const index = this.items().findIndex((item) => item.key === this.activeKey());
    return index < 0 ? 0 : index;
  });

  protected nzSize(): 'small' | 'default' | 'large' {
    return this.size() === 'medium' ? 'default' : (this.size() as 'small' | 'large');
  }

  protected onIndex(index: number): void {
    const item = this.items()[index];
    if (item) this.activeKey.set(item.key);
  }
}
