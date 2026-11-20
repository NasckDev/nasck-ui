import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SAMPLE_COLUMNS, SAMPLE_ROWS } from '../sample-data.ts';
import { AppAlert } from './AppAlert.tsx';
import { AppButton } from './AppButton.tsx';
import { AppAvatar, initials } from './AppAvatar.tsx';
import { AppCard } from './AppCard.tsx';
import { AppChart } from './AppChart.tsx';
import { AppDrawer } from './AppDrawer.tsx';
import { AppDropdown } from './AppDropdown.tsx';
import { AppEmpty } from './AppEmpty.tsx';
import { AppMenu } from './AppMenu.tsx';
import { AppModal } from './AppModal.tsx';
import { AppPagination } from './AppPagination.tsx';
import { AppSkeleton } from './AppSkeleton.tsx';
import { AppStatistic } from './AppStatistic.tsx';
import { AppSteps } from './AppSteps.tsx';
import { AppTable } from './AppTable.tsx';
import { AppTabs } from './AppTabs.tsx';
import { AppStatus, AppTag } from './AppTag.tsx';
import { AppThemeProvider } from './AppThemeProvider.tsx';
import { AppTooltip } from './AppTooltip.tsx';

describe('AppTable', () => {
  it('formats currency, numbers and dates in pt-BR', () => {
    render(<AppTable columns={SAMPLE_COLUMNS} data={SAMPLE_ROWS.slice(0, 1)} />);
    const row = screen.getByRole('row', { name: /Padaria Estrela/ });
    expect(within(row).getByText(/R\$\s?189,90/)).toBeInTheDocument();
    expect(within(row).getByText('12/03/2024')).toBeInTheDocument();
  });

  it('sorts by a sortable column', async () => {
    render(<AppTable columns={SAMPLE_COLUMNS} data={SAMPLE_ROWS} />);
    await userEvent.click(
      screen.getAllByRole('columnheader', { name: /Usuários/ })[0] as HTMLElement,
    );
    const firstCell = screen.getAllByRole('row')[1];
    expect(firstCell).toHaveTextContent('Studio Nova Forma');
  });

  it('reports row clicks and makes the rows focusable only then', async () => {
    const onRowClick = vi.fn();
    const { rerender } = render(<AppTable columns={SAMPLE_COLUMNS} data={SAMPLE_ROWS} />);
    expect(screen.getByRole('row', { name: /Padaria Estrela/ })).not.toHaveAttribute('tabindex');
    rerender(<AppTable columns={SAMPLE_COLUMNS} data={SAMPLE_ROWS} onRowClick={onRowClick} />);
    const row = screen.getByRole('row', { name: /Padaria Estrela/ });
    expect(row).toHaveAttribute('tabindex', '0');
    await userEvent.click(row);
    expect(onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ cliente: 'Padaria Estrela' }),
    );
  });

  it('shows the empty text with no data', () => {
    render(<AppTable columns={SAMPLE_COLUMNS} data={[]} emptyText="Nenhum cliente." />);
    expect(screen.getByText('Nenhum cliente.')).toBeInTheDocument();
  });

  it('paginates', () => {
    render(<AppTable columns={SAMPLE_COLUMNS} data={SAMPLE_ROWS} pageSize={2} />);
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });
});

describe('AppStatistic, AppCard, AppTag, AppStatus', () => {
  it('formats the number in pt-BR and announces the trend', () => {
    render(<AppStatistic title="Receita" value={66400} precision={2} prefix="R$ " trend="up" />);
    expect(screen.getByText('Receita')).toBeInTheDocument();
    expect(screen.getByText(/66\.400/)).toBeInTheDocument();
    expect(screen.getByText('em alta')).toBeInTheDocument();
  });

  it('renders the card title, extra and body, and a loading skeleton', () => {
    const { rerender } = render(
      <AppCard title="Resumo" extra="Hoje">
        Corpo
      </AppCard>,
    );
    expect(screen.getByText('Resumo')).toBeInTheDocument();
    expect(screen.getByText('Hoje')).toBeInTheDocument();
    expect(screen.getByText('Corpo')).toBeInTheDocument();
    rerender(
      <AppCard title="Resumo" loading>
        Corpo
      </AppCard>,
    );
    expect(screen.queryByText('Corpo')).toBeNull();
  });

  it('closes a tag', async () => {
    const onClose = vi.fn();
    render(<AppTag label="Pendente" closable onClose={onClose} />);
    await userEvent.click(screen.getByLabelText(/fechar|close/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the status as text', () => {
    render(<AppStatus status="warning" label="Pendente" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});

describe('AppModal and AppDrawer', () => {
  it('opens the modal and confirms or cancels', async () => {
    const onOk = vi.fn();
    const onCancel = vi.fn();
    render(
      <AppModal
        open
        title="Cancelar assinatura"
        okText="Sim"
        cancelText="Não"
        onOk={onOk}
        onCancel={onCancel}
      >
        Tem certeza?
      </AppModal>,
    );
    expect(await screen.findByRole('dialog', { name: 'Cancelar assinatura' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Sim' }));
    await userEvent.click(screen.getByRole('button', { name: 'Não' }));
    expect(onOk).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('keeps the modal closed when open is false', () => {
    render(
      <AppModal open={false} title="Oculto">
        x
      </AppModal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the drawer and closes it', async () => {
    const onClose = vi.fn();
    render(
      <AppDrawer open title="Detalhes" onClose={onClose}>
        Conteúdo
      </AppDrawer>,
    );
    expect(await screen.findByText('Conteúdo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('AppTabs, AppSteps, AppMenu, AppDropdown, AppPagination', () => {
  it('switches tabs and reports the key', async () => {
    const onChange = vi.fn();
    render(
      <AppTabs
        items={[
          { key: 'a', label: 'Primeira', content: 'Conteúdo A' },
          { key: 'b', label: 'Segunda', content: 'Conteúdo B' },
        ]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Segunda' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('renders the step titles and the current step', () => {
    render(
      <AppSteps
        current={1}
        items={[{ title: 'Dados' }, { title: 'Plano' }, { title: 'Pronto' }]}
      />,
    );
    expect(screen.getByText('Plano').closest('.ant-steps-item')).toHaveClass(
      'ant-steps-item-process',
    );
  });

  it('selects a menu item', async () => {
    const onSelect = vi.fn();
    render(
      <AppMenu
        items={[
          { key: 'inicio', label: 'Início' },
          { key: 'clientes', label: 'Clientes' },
        ]}
        selectedKey="inicio"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'Clientes' }));
    expect(onSelect).toHaveBeenCalledWith('clientes');
  });

  it('picks a dropdown item', async () => {
    const onSelect = vi.fn();
    render(
      <AppDropdown
        label="Ações"
        items={[{ key: 'editar', label: 'Editar' }]}
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /Ações/ }));
    await userEvent.click(await screen.findByText('Editar'));
    expect(onSelect).toHaveBeenCalledWith('editar');
  });

  it('changes page', async () => {
    const onChange = vi.fn();
    render(<AppPagination total={50} pageSize={10} current={1} onChange={onChange} />);
    await userEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2, 10);
  });
});

describe('feedback components', () => {
  it('shows the empty state action', async () => {
    const onAction = vi.fn();
    render(<AppEmpty title="Nada" actionLabel="Criar" onAction={onAction} />);
    await userEvent.click(screen.getByRole('button', { name: 'Criar' }));
    expect(onAction).toHaveBeenCalled();
  });

  it('shows the skeleton while loading and the content after', () => {
    const { rerender } = render(<AppSkeleton>Pronto</AppSkeleton>);
    expect(screen.queryByText('Pronto')).toBeNull();
    rerender(<AppSkeleton loading={false}>Pronto</AppSkeleton>);
    expect(screen.getByText('Pronto')).toBeInTheDocument();
  });

  it('shows and closes an alert', async () => {
    const onClose = vi.fn();
    render(
      <AppAlert
        type="error"
        title="Falhou"
        description="Tente de novo."
        closable
        onClose={onClose}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou');
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the tooltip on hover', async () => {
    render(
      <AppTooltip title="Baixar PDF">
        <button type="button">Baixar</button>
      </AppTooltip>,
    );
    await userEvent.hover(screen.getByRole('button', { name: 'Baixar' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Baixar PDF');
  });
});

describe('AppAvatar', () => {
  it('builds initials from the name', () => {
    expect(initials('Marina Albuquerque')).toBe('MA');
    expect(initials('Marina')).toBe('M');
    expect(initials(undefined)).toBe('');
  });

  it('exposes the name to assistive technology', () => {
    render(<AppAvatar name="Marina Albuquerque" />);
    expect(screen.getByRole('img', { name: 'Marina Albuquerque' })).toHaveTextContent('MA');
  });
});

describe('AppChart', () => {
  const props = { categories: ['jan', 'fev'], series: [{ name: 'Receita', data: [1000, 2000] }] };

  it('gives screen readers a description and a data table', () => {
    render(<AppChart {...props} ariaLabel="Receita em alta" valueFormat="currency" />);
    expect(screen.getByRole('img', { name: 'Receita em alta' })).toBeInTheDocument();
    const table = screen.getByRole('table', { name: 'Receita em alta' });
    expect(within(table).getByRole('rowheader', { name: 'fev' })).toBeInTheDocument();
    expect(within(table).getByText(/R\$\s?2\.000,00/)).toBeInTheDocument();
  });

  it('shows the empty message with no data', () => {
    render(<AppChart categories={[]} series={[]} emptyText="Sem dados." />);
    expect(screen.getByText('Sem dados.')).toBeInTheDocument();
  });

  it('shows a skeleton while loading', () => {
    const { container } = render(<AppChart {...props} loading />);
    expect(container.querySelector('.ant-skeleton')).not.toBeNull();
  });
});

describe('AppThemeProvider', () => {
  it('throws a clear error for an unknown preset', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <AppThemeProvider preset="nao-existe">
          <span>x</span>
        </AppThemeProvider>,
      ),
    ).toThrow(/Preset desconhecido/);
    vi.restoreAllMocks();
  });

  it('renders its children for a valid preset', () => {
    render(
      <AppThemeProvider preset="opsflow" mode="dark" density="compact">
        <AppButton variant="primary">Entrar</AppButton>
      </AppThemeProvider>,
    );
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });
});
