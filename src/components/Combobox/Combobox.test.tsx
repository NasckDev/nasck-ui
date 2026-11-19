import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Combobox, filterOptions, type ComboboxOption } from './Combobox';

const options: ComboboxOption[] = [
  { value: 'sp', label: 'São Paulo', description: 'SP' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true },
  { value: 'ba', label: 'Bahia' },
];

describe('Combobox', () => {
  it('exposes combobox semantics, closed by default', () => {
    render(<Combobox label="Estado" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Estado' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('opens with ArrowDown and moves the active option via aria-activedescendant', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Estado" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Estado' });
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const first = screen.getByRole('option', { name: /São Paulo/ });
    expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Rio de Janeiro' }).id,
    );
    // Minas Gerais is disabled, so the next stop is Bahia.
    await user.keyboard('{ArrowDown}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Bahia' }).id,
    );
    await user.keyboard('{ArrowUp}');
    expect(input.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Rio de Janeiro' }).id,
    );
  });

  it('filters by typing, ignoring accents, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Estado" options={options} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Estado' });
    await user.type(input, 'sao');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('sp');
    expect(input).toHaveValue('São Paulo');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('selects with the mouse', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox label="Estado" options={options} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Mostrar opções' }));
    await user.click(screen.getByRole('option', { name: 'Bahia' }));
    expect(onValueChange).toHaveBeenCalledWith('ba');
    expect(screen.getByRole('combobox')).toHaveValue('Bahia');
  });

  it('closes on Escape and restores the selected label', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Estado" options={options} defaultValue="ba" />);
    const input = screen.getByRole('combobox', { name: 'Estado' });
    expect(input).toHaveValue('Bahia');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    await user.type(input, 'xyz');
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveValue('Bahia');
  });

  it('announces the number of results and the empty state in a live region', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Estado" options={options} />);
    await user.type(screen.getByRole('combobox'), 'a');
    expect(screen.getByRole('status')).toHaveTextContent(/resultados/);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum resultado');
  });

  it('wires description and error to the input', () => {
    render(
      <Combobox
        label="Estado"
        options={options}
        description="Onde mora"
        error="Escolha um estado"
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Estado' });
    expect(input).toHaveAccessibleDescription('Onde mora Escolha um estado');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no axe violations open or closed', async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox label="Estado" options={options} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('filterOptions', () => {
  it('returns everything for an empty query', () => {
    expect(filterOptions(options, '  ')).toHaveLength(4);
  });
});
