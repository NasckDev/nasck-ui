import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Checkbox } from '../Checkbox/Checkbox';
import { Select } from '../Select/Select';
import { Switch } from '../Switch/Switch';
import { TextField } from './TextField';

describe('TextField', () => {
  it('links label, description and error through ARIA', () => {
    render(
      <TextField
        label="E-mail"
        description="Usaremos para recuperar a conta."
        error="Informe um e-mail válido."
        required
      />,
    );
    const input = screen.getByRole('textbox', { name: /E-mail/ });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'Usaremos para recuperar a conta. Informe um e-mail válido.',
    );
  });

  it('accepts typing and keeps a custom id', async () => {
    const user = userEvent.setup();
    render(<TextField label="Nome" id="nome" />);
    const input = screen.getByLabelText('Nome');

    await user.type(input, 'Ada');

    expect(input).toHaveValue('Ada');
    expect(input).toHaveAttribute('id', 'nome');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <TextField label="Nome" />
        <TextField label="E-mail" error="Obrigatório" />
        <TextField label="Bloqueado" disabled />
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Checkbox', () => {
  it('toggles with click and Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Aceito os termos" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Aceito os termos' });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
  });

  it('supports the indeterminate state and error message', () => {
    render(<Checkbox label="Selecionar todos" indeterminate error="Selecione ao menos um" />);
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAccessibleDescription('Selecione ao menos um');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Checkbox label="Receber novidades" description="Uma vez por mês." />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Switch', () => {
  it('exposes role switch and toggles with click, Space and Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Modo escuro" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Modo escuro' });

    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.keyboard('{Enter}');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });

  it('toggles when the visible label is clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notificações" defaultChecked />);
    await user.click(screen.getByText('Notificações'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('respects controlled value and preventDefault from onClick', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Wi-Fi"
        checked
        onCheckedChange={onCheckedChange}
        onClick={(event) => event.preventDefault()}
      />,
    );
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Switch label="Sons" description="Toca ao receber mensagens." />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Select', () => {
  const options = [
    { value: 'br', label: 'Brasil' },
    { value: 'pt', label: 'Portugal' },
    { value: 'ao', label: 'Angola', disabled: true },
  ];

  it('selects an option and wires error state', async () => {
    const user = userEvent.setup();
    render(<Select label="País" options={options} placeholder="Escolha" error="Obrigatório" />);
    const select = screen.getByRole('combobox', { name: 'País' });

    await user.selectOptions(select, 'pt');

    expect(select).toHaveValue('pt');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('option', { name: 'Angola' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Select label="País" options={options} description="Residência" />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
