import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { axeViolations } from '../test/axe';
import { Accordion } from './Accordion/Accordion';
import { Button } from './Button/Button';
import { Checkbox } from './Checkbox/Checkbox';
import { Pagination } from './Pagination/Pagination';
import { Switch } from './Switch/Switch';
import { Table, type TableColumn } from './Table/Table';
import { Tabs } from './Tabs/Tabs';

describe('Tabs with unusual values', () => {
  const items = [
    { id: 'a b', label: 'Primeira', content: 'A' },
    { id: 'c"d', label: 'Segunda', content: 'B' },
  ];

  it('falls back to the first enabled tab when `value` matches nothing', () => {
    render(<Tabs label="Seções" items={items} value="nao-existe" />);
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('aria-selected', 'true');
  });

  it('wires ids correctly even when item ids contain spaces and quotes', async () => {
    const { container } = render(<Tabs label="Seções" items={items} />);
    const tab = screen.getByRole('tab', { name: 'Primeira' });
    const panelId = tab.getAttribute('aria-controls') ?? '';
    expect(panelId).not.toMatch(/\s/);
    expect(document.getElementById(panelId)).toHaveAttribute('aria-labelledby', tab.id);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Accordion ids', () => {
  it('does not break aria-controls when ids contain spaces', async () => {
    const { container } = render(
      <Accordion
        items={[{ id: 'meu item', title: 'Item', content: 'Texto' }]}
        defaultValue={['meu item']}
      />,
    );
    const button = screen.getByRole('button', { name: 'Item' });
    const panelId = button.getAttribute('aria-controls') ?? '';
    expect(panelId).not.toMatch(/\s/);
    expect(document.getElementById(panelId)).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Button aria-disabled', () => {
  it('keeps a consumer-provided aria-disabled and forces it while loading', () => {
    const { rerender } = render(<Button aria-disabled="true">Salvar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    rerender(<Button loading>Salvar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('ref forwarding', () => {
  it('forwards refs on Checkbox (alongside indeterminate) and Switch', () => {
    const checkboxRef = createRef<HTMLInputElement>();
    const switchRef = createRef<HTMLButtonElement>();
    render(
      <>
        <Checkbox label="Todos" indeterminate ref={checkboxRef} />
        <Switch label="Avisos" ref={switchRef} />
      </>,
    );
    expect(checkboxRef.current).toBeInstanceOf(HTMLInputElement);
    expect(checkboxRef.current?.indeterminate).toBe(true);
    expect(switchRef.current).toBe(screen.getByRole('switch'));
  });
});

describe('Pagination accessibility', () => {
  it('keeps focus on the "Próxima" button at the last page and announces the page', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [page, setPage] = useState(2);
      return <Pagination page={page} pageCount={3} onPageChange={setPage} />;
    }
    render(<Harness />);
    const next = screen.getByRole('button', { name: /Próxima/ });
    next.focus();
    await user.keyboard('{Enter}');
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Página 3 de 3');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Página 3 de 3');
  });
});

describe('Table column typing', () => {
  it('requires sortValue on sortable columns', () => {
    // @ts-expect-error a sortable column without sortValue must not compile
    const invalid: TableColumn<{ id: string }> = {
      id: 'x',
      header: 'X',
      cell: () => null,
      sortable: true,
    };
    expect(invalid.sortable).toBe(true);
    const valid: TableColumn<{ id: string }> = {
      id: 'x',
      header: 'X',
      cell: () => null,
      sortable: true,
      sortValue: (row) => row.id,
    };
    render(<Table caption="T" columns={[valid]} rows={[{ id: 'a' }]} getRowId={(row) => row.id} />);
    expect(screen.getByRole('table', { name: 'T' })).toBeInTheDocument();
  });
});
