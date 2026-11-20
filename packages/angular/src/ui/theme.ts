import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  resolvedTokens,
  toNgZorroVariables,
  type Density,
  type ResolvedTokens,
  type ThemeMode,
} from '@nasckdev/nasck-ui-tokens';

/** Aplica um preset de paleta ao NG-ZORRO por variaveis CSS no elemento raiz. */
@Injectable({ providedIn: 'root' })
export class NasckThemeService {
  private readonly document = inject(DOCUMENT);
  readonly tokens = signal<ResolvedTokens>(resolvedTokens['nasck']?.light ?? {});
  readonly mode = signal<ThemeMode>('light');
  readonly preset = signal('nasck');

  apply(preset: string, mode: ThemeMode, density: Density = 'default'): void {
    const resolved = resolvedTokens[preset]?.[mode];
    if (!resolved) {
      throw new Error(`Preset desconhecido: "${preset}".`);
    }
    const root = this.document.documentElement;
    for (const [name, value] of Object.entries(toNgZorroVariables(resolved))) {
      root.style.setProperty(name, value);
    }
    root.dataset['theme'] = mode;
    root.dataset['density'] = density;
    this.tokens.set(resolved);
    this.mode.set(mode);
    this.preset.set(preset);
  }
}

@Component({
  selector: 'app-theme-provider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AppThemeProviderComponent {
  readonly preset = input('nasck');
  readonly mode = input<ThemeMode>('light');
  readonly density = input<Density>('default');
  private readonly service = inject(NasckThemeService);

  constructor() {
    effect(() => this.service.apply(this.preset(), this.mode(), this.density()));
  }
}
