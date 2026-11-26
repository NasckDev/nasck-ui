import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { Type } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { SAMPLE_COLUMNS, SAMPLE_ROWS } from '../sample-data';
import { AppAlertComponent } from './app-alert.component';
import { AppAvatarComponent, initials } from './app-avatar.component';
import { AppButtonComponent } from './app-button.component';
import { AppCardComponent } from './app-card.component';
import { AppChartComponent } from './app-chart.component';
import { AppCheckboxComponent } from './app-checkbox.component';
import { AppEmptyComponent } from './app-empty.component';
import { AppIconButtonComponent } from './app-icon-button.component';
import { AppInputComponent } from './app-input.component';
import { AppPaginationComponent } from './app-pagination.component';
import { AppSkeletonComponent } from './app-skeleton.component';
import { AppStatisticComponent } from './app-statistic.component';
import { AppTableComponent } from './app-table.component';
import { AppTabsComponent } from './app-tabs.component';
import { AppStatusComponent, AppTagComponent } from './app-tag.component';
import { provideNasckUi } from './providers';
import { NasckThemeService } from './theme';

// jsdom nao tem ResizeObserver; o ECharts (via ngx-echarts) exige.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= ResizeObserverStub;

type Inputs = Record<string, unknown>;

async function setup<T>(component: Type<T>, inputs: Inputs = {}): Promise<ComponentFixture<T>> {
  TestBed.configureTestingModule({ imports: [component], providers: [provideNasckUi()] });
  const fixture = TestBed.createComponent(component);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

function root(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement as HTMLElement;
}

describe('AppButton', () => {
  it('renders the variant, danger, block and type', async () => {
    const fixture = await setup(AppButtonComponent, {
      variant: 'primary',
      danger: true,
      block: true,
      htmlType: 'submit',
    });
    const button = root(fixture).querySelector('button');
    expect(button?.classList).toContain('ant-btn-primary');
    expect(button?.classList).toContain('ant-btn-dangerous');
    expect(button?.classList).toContain('ant-btn-block');
    expect(button?.getAttribute('type')).toBe('submit');
  });

  it('emits clicked and respects disabled', async () => {
    const fixture = await setup(AppButtonComponent);
    let clicks = 0;
    fixture.componentInstance.clicked.subscribe(() => (clicks += 1));
    root(fixture).querySelector('button')?.click();
    expect(clicks).toBe(1);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(root(fixture).querySelector('button')?.disabled).toBe(true);
  });

  it('shows the loading state', async () => {
    const fixture = await setup(AppButtonComponent, { loading: true });
    expect(root(fixture).querySelector('button')?.getAttribute('aria-busy')).toBe('true');
  });
});

describe('AppIconButton', () => {
  it('uses the label as the accessible name', async () => {
    const fixture = await setup(AppIconButtonComponent, { icon: 'edit', label: 'Editar cliente' });
    expect(root(fixture).querySelector('button')?.getAttribute('aria-label')).toBe(
      'Editar cliente',
    );
  });
});

describe('AppInput', () => {
  it('links the label to the control and shows the error as an alert', async () => {
    const fixture = await setup(AppInputComponent, {
      label: 'E-mail',
      value: 'x',
      errorMessage: 'Informe um e-mail completo.',
    });
    const input = root(fixture).querySelector('input');
    const label = root(fixture).querySelector('label');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    const alert = root(fixture).querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Informe um e-mail completo.');
    expect(input?.getAttribute('aria-describedby')).toBe(alert?.id);
  });

  it('updates the model when the user types', async () => {
    const fixture = await setup(AppInputComponent, { label: 'Nome' });
    const input = root(fixture).querySelector('input') as HTMLInputElement;
    input.value = 'Marina';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Marina');
  });

  it('renders a textarea', async () => {
    const fixture = await setup(AppInputComponent, { label: 'Notas', type: 'textarea' });
    expect(root(fixture).querySelector('textarea')).not.toBeNull();
  });

  it('disables the control', async () => {
    const fixture = await setup(AppInputComponent, { label: 'Nome', disabled: true });
    expect(root(fixture).querySelector('input')?.disabled).toBe(true);
  });
});

describe('AppCheckbox', () => {
  it('toggles and shows the error', async () => {
    const fixture = await setup(AppCheckboxComponent, {
      label: 'Aceito',
      errorMessage: 'Aceite para continuar.',
    });
    const input = root(fixture).querySelector('input') as HTMLInputElement;
    input.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(root(fixture).querySelector('[role="alert"]')?.textContent).toContain(
      'Aceite para continuar.',
    );
  });
});

describe('AppTable', () => {
  it('formats currency, numbers and dates in pt-BR', async () => {
    const fixture = await setup(AppTableComponent, {
      columns: SAMPLE_COLUMNS,
      data: SAMPLE_ROWS.slice(0, 1),
    });
    const text = root(fixture).textContent ?? '';
    expect(text).toMatch(/R\$\s?189,90/);
    expect(text).toContain('12/03/2024');
  });

  it('paginates and shows the empty text', async () => {
    const paged = await setup(AppTableComponent, {
      columns: SAMPLE_COLUMNS,
      data: SAMPLE_ROWS,
      pageSize: 2,
    });
    expect(root(paged).querySelectorAll('tbody tr.ant-table-row').length).toBe(2);
    TestBed.resetTestingModule();
    const empty = await setup(AppTableComponent, {
      columns: SAMPLE_COLUMNS,
      data: [],
      emptyText: 'Nenhum cliente.',
    });
    expect(root(empty).textContent).toContain('Nenhum cliente.');
  });

  it('makes rows focusable only when someone listens to rowClick', async () => {
    const fixture = await setup(AppTableComponent, { columns: SAMPLE_COLUMNS, data: SAMPLE_ROWS });
    expect(root(fixture).querySelector('tbody tr.ant-table-row')?.hasAttribute('tabindex')).toBe(
      false,
    );
    TestBed.resetTestingModule();
    const listening = TestBed.configureTestingModule({
      imports: [AppTableComponent],
      providers: [provideNasckUi()],
    }).createComponent(AppTableComponent);
    listening.componentRef.setInput('columns', SAMPLE_COLUMNS);
    listening.componentRef.setInput('data', SAMPLE_ROWS);
    const clicked: unknown[] = [];
    listening.componentInstance.rowClick.subscribe((row) => clicked.push(row));
    listening.detectChanges();
    await listening.whenStable();
    listening.detectChanges();
    const row = root(listening).querySelector('tbody tr.ant-table-row') as HTMLElement;
    expect(row.getAttribute('tabindex')).toBe('0');
    row.click();
    expect(clicked).toHaveLength(1);
  });
});

describe('display components', () => {
  it('AppStatistic formats pt-BR and announces the trend', async () => {
    const fixture = await setup(AppStatisticComponent, {
      title: 'Receita',
      value: 66400,
      precision: 2,
      prefix: 'R$ ',
      trend: 'up',
    });
    const text = root(fixture).textContent ?? '';
    expect(text).toContain('66.400,00');
    expect(root(fixture).querySelector('.sr-only')?.textContent).toBe('em alta');
  });

  it('AppCard renders title, extra and body', async () => {
    const fixture = await setup(AppCardComponent, { title: 'Resumo', extra: 'Hoje' });
    const text = root(fixture).textContent ?? '';
    expect(text).toContain('Resumo');
    expect(text).toContain('Hoje');
  });

  it('AppTag and AppStatus show their text', async () => {
    const tag = await setup(AppTagComponent, { label: 'Pendente', color: 'warning' });
    expect(root(tag).textContent).toContain('Pendente');
    TestBed.resetTestingModule();
    const status = await setup(AppStatusComponent, { status: 'success', label: 'Aprovado' });
    expect(root(status).textContent).toContain('Aprovado');
  });

  it('AppAvatar builds initials', async () => {
    expect(initials('Marina Albuquerque')).toBe('MA');
    const fixture = await setup(AppAvatarComponent, { name: 'Marina Albuquerque' });
    expect(root(fixture).getAttribute('role')).toBe('img');
    expect(root(fixture).getAttribute('aria-label')).toBe('Marina Albuquerque');
    expect(root(fixture).textContent).toContain('MA');
  });
});

describe('feedback and navigation', () => {
  it('AppEmpty emits the action', async () => {
    const fixture = await setup(AppEmptyComponent, { title: 'Nada', actionLabel: 'Criar' });
    let actions = 0;
    fixture.componentInstance.action.subscribe(() => (actions += 1));
    const button = Array.from(root(fixture).querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Criar'),
    );
    button?.click();
    expect(actions).toBe(1);
  });

  it('AppSkeleton shows a skeleton while loading and nothing of it after', async () => {
    const fixture = await setup(AppSkeletonComponent);
    expect(root(fixture).querySelector('.ant-skeleton')).not.toBeNull();
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    expect(root(fixture).querySelector('.ant-skeleton')).toBeNull();
  });

  it('AppAlert shows the message with the type class', async () => {
    const fixture = await setup(AppAlertComponent, {
      type: 'error',
      title: 'Falhou',
      description: 'Tente de novo.',
    });
    expect(root(fixture).querySelector('.ant-alert-error')).not.toBeNull();
    expect(root(fixture).textContent).toContain('Falhou');
  });

  it('AppTabs renders the tabs and the selected content', async () => {
    const fixture = await setup(AppTabsComponent, {
      items: [
        { key: 'a', label: 'Primeira', content: 'Conteudo A' },
        { key: 'b', label: 'Segunda', content: 'Conteudo B' },
      ],
      activeKey: 'b',
    });
    const selected = root(fixture).querySelector('.ant-tabs-tab-active');
    expect(selected?.textContent).toContain('Segunda');
  });

  it('AppPagination shows the range text', async () => {
    const fixture = await setup(AppPaginationComponent, { total: 50, pageSize: 10, current: 2 });
    expect(root(fixture).textContent).toContain('11-20 de 50');
  });
});

describe('AppChart and theme', () => {
  it('gives screen readers a description and a data table', async () => {
    TestBed.configureTestingModule({ imports: [AppChartComponent], providers: [provideNasckUi()] });
    const fixture = TestBed.createComponent(AppChartComponent);
    fixture.componentRef.setInput('categories', ['jan', 'fev']);
    fixture.componentRef.setInput('series', [{ name: 'Receita', data: [1000, 2000] }]);
    fixture.componentRef.setInput('ariaLabel', 'Receita em alta');
    fixture.componentRef.setInput('valueFormat', 'currency');
    fixture.detectChanges();
    const table = root(fixture).querySelector('table');
    expect(table?.querySelector('caption')?.textContent?.trim()).toBe('Receita em alta');
    expect(table?.textContent).toMatch(/R\$\s?2\.000,00/);
  });

  it('keeps the data table inside a 1px box, so a wide table never widens the page', () => {
    TestBed.configureTestingModule({ imports: [AppChartComponent], providers: [provideNasckUi()] });
    const fixture = TestBed.createComponent(AppChartComponent);
    fixture.componentRef.setInput('categories', ['jan', 'fev']);
    fixture.componentRef.setInput('series', [{ name: 'Receita', data: [1000, 2000] }]);
    fixture.detectChanges();
    const table = root(fixture).querySelector('table');
    // Uma tabela ignora width: 1px; quem esconde e corta precisa ser um bloco em volta dela.
    expect(table?.classList.contains('sr-only')).toBe(false);
    expect(table?.parentElement?.classList.contains('sr-only')).toBe(true);
  });

  it('shows the empty message with no data', async () => {
    const fixture = await setup(AppChartComponent, {
      categories: [],
      series: [],
      emptyText: 'Sem dados.',
    });
    expect(root(fixture).textContent).toContain('Sem dados.');
  });

  it('applies a preset as css variables and rejects unknown presets', () => {
    const service = TestBed.inject(NasckThemeService);
    service.apply('opsflow', 'dark');
    const rootStyle = document.documentElement.style;
    expect(rootStyle.getPropertyValue('--ant-color-primary')).not.toBe('');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(() => service.apply('nao-existe', 'light')).toThrow(/Preset desconhecido/);
  });
});
