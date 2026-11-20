import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppButton } from './AppButton.tsx';
import { AppCheckbox } from './AppCheckbox.tsx';
import { AppDatePicker } from './AppDatePicker.tsx';
import { AppForm, AppFormItem } from './AppForm.tsx';
import { AppIconButton } from './AppIconButton.tsx';
import { AppInput } from './AppInput.tsx';
import { AppSelect } from './AppSelect.tsx';
import { AppSwitch } from './AppSwitch.tsx';

describe('AppButton', () => {
  it('calls onClick and renders its content', async () => {
    const onClick = vi.fn();
    render(<AppButton onClick={onClick}>Salvar</AppButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <AppButton disabled onClick={onClick}>
        Salvar
      </AppButton>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('shows the loading state and the submit type', () => {
    render(
      <AppButton loading htmlType="submit">
        Enviar
      </AppButton>,
    );
    const button = screen.getByRole('button', { name: /Enviar/ });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('maps variant, danger and block', () => {
    render(
      <AppButton variant="primary" danger block>
        Excluir
      </AppButton>,
    );
    const button = screen.getByRole('button', { name: 'Excluir' });
    expect(button).toHaveClass('ant-btn-color-dangerous');
    expect(button).toHaveClass('ant-btn-block');
  });
});

describe('AppIconButton', () => {
  it('exposes the label as the accessible name', async () => {
    const onClick = vi.fn();
    render(<AppIconButton icon="edit" label="Editar cliente" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Editar cliente' }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('AppInput', () => {
  it('links the label to the control and reports changes', async () => {
    const onChange = vi.fn();
    render(<AppInput label="E-mail" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('E-mail'), 'ab');
    expect(onChange).toHaveBeenLastCalledWith('ab');
  });

  it('describes the error and marks the field invalid', () => {
    render(<AppInput label="E-mail" value="x" errorMessage="Informe um e-mail completo." />);
    const input = screen.getByLabelText('E-mail');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Informe um e-mail completo.');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
  });

  it('shows the hint when there is no error', () => {
    render(<AppInput label="Nome" hint="Como no documento." />);
    expect(screen.getByText('Como no documento.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders a textarea and a password field', () => {
    const { rerender } = render(<AppInput label="Notas" type="textarea" />);
    expect(screen.getByLabelText('Notas').tagName).toBe('TEXTAREA');
    rerender(<AppInput label="Senha" type="password" />);
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
  });

  it('disables the control', () => {
    render(<AppInput label="Nome" disabled />);
    expect(screen.getByLabelText('Nome')).toBeDisabled();
  });
});

describe('AppSelect', () => {
  const options = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
  ];

  it('labels the combobox and shows the selected option', () => {
    render(<AppSelect label="Estado" options={options} value="sp" />);
    expect(screen.getByRole('combobox', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('selects an option and notifies', async () => {
    const onChange = vi.fn();
    render(<AppSelect label="Estado" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Estado' }));
    await userEvent.click(await screen.findByText('Rio de Janeiro'));
    expect(onChange).toHaveBeenCalledWith('rj');
  });

  it('shows the empty text when there are no options', async () => {
    render(<AppSelect label="Estado" options={[]} emptyText="Nenhum estado" />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Estado' }));
    expect(await screen.findByText('Nenhum estado')).toBeInTheDocument();
  });

  it('shows the error message', () => {
    render(<AppSelect label="Estado" options={options} errorMessage="Escolha um estado." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Escolha um estado.');
  });
});

describe('AppCheckbox and AppSwitch', () => {
  it('toggles the checkbox and reports the new value', async () => {
    const onChange = vi.fn();
    render(<AppCheckbox label="Aceito" onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Aceito' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('shows the checkbox error', () => {
    render(<AppCheckbox label="Aceito" errorMessage="Aceite para continuar." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Aceite para continuar.');
  });

  it('toggles the switch by its visible label', async () => {
    const onChange = vi.fn();
    render(<AppSwitch label="Avisos" onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Avisos' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle a disabled switch', async () => {
    const onChange = vi.fn();
    render(<AppSwitch label="Avisos" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch', { name: 'Avisos' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('AppDatePicker', () => {
  it('shows an ISO value in the Brazilian format', () => {
    render(<AppDatePicker label="Vencimento" value="2026-12-15" />);
    expect(screen.getByLabelText('Vencimento')).toHaveValue('15/12/2026');
  });

  it('shows the placeholder when empty', () => {
    render(<AppDatePicker label="Vencimento" />);
    expect(screen.getByPlaceholderText('DD/MM/AAAA')).toBeInTheDocument();
  });
});

describe('AppForm', () => {
  it('submits and groups the item under its label', async () => {
    const onSubmit = vi.fn();
    render(
      <AppForm onSubmit={onSubmit}>
        <AppFormItem label="Notificações">
          <AppSwitch label="Por e-mail" />
        </AppFormItem>
        <AppButton htmlType="submit">Criar</AppButton>
      </AppForm>,
    );
    expect(screen.getByRole('group', { name: 'Notificações' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Criar' }));
    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
