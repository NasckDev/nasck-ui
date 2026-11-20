import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { axeViolations } from '../test/axe';
import { Button } from './Button/Button';
import { Combobox } from './Combobox/Combobox';
import { Dialog } from './Dialog/Dialog';
import { Menu } from './Menu/Menu';
import { ToastProvider, useToast } from './Toast/Toast';
import { Tooltip } from './Tooltip/Tooltip';
import { TextField } from './TextField/TextField';

/** Parent state changes on every keystroke and passes an inline `onOpenChange`. */
function ControlledForm() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)} title="Convidar">
      <TextField label="Nome" value={name} onChange={(event) => setName(event.target.value)} />
      <TextField label="E-mail" />
    </Dialog>
  );
}

describe('Dialog focus and re-render (inline callbacks)', () => {
  it('keeps focus where the person is typing while the parent re-renders', async () => {
    const user = userEvent.setup();
    render(<ControlledForm />);
    const email = screen.getByLabelText('E-mail');
    await user.click(email);
    await user.keyboard('a');
    expect(email).toHaveFocus();

    const name = screen.getByLabelText('Nome');
    await user.click(name);
    await user.keyboard('Ana');
    expect(name).toHaveValue('Ana');
    expect(name).toHaveFocus();
  });

  it('locks background scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    render(<ControlledForm />);
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('');
  });
});

describe('Escape inside nested layers', () => {
  it('closes only the tooltip first when it is open inside a Dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Diálogo">
        <Tooltip content="Dica">
          <Button>Ajuda</Button>
        </Tooltip>
      </Dialog>,
    );
    act(() => screen.getByRole('button', { name: 'Ajuda' }).focus());
    expect(screen.getByRole('tooltip')).toBeVisible();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes only the menu when it is open inside a Dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Diálogo">
        <Menu label="Ações" items={[{ id: 'a', label: 'Editar' }]} />
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes only the open list of a Combobox inside a Dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Diálogo">
        <Combobox label="Cidade" options={[{ value: 'sp', label: 'São Paulo' }]} />
      </Dialog>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('only the top Dialog of a stack handles Escape', async () => {
    const user = userEvent.setup();
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <>
        <Dialog open onOpenChange={outer} title="Externo" />
        <Dialog open onOpenChange={inner} title="Interno" />
      </>,
    );
    await user.keyboard('{Escape}');
    expect(inner).toHaveBeenCalledWith(false);
    expect(outer).not.toHaveBeenCalled();
  });
});

describe('Menu focus', () => {
  it('does not pull focus back to the first item when the parent re-renders', async () => {
    const user = userEvent.setup();
    function Parent() {
      const [count, setCount] = useState(0);
      return (
        <>
          <button type="button" onClick={() => setCount(count + 1)}>
            Atualizar
          </button>
          <Menu
            label="Ações"
            items={[
              { id: 'a', label: 'Editar' },
              { id: 'b', label: `Duplicar ${count}` },
            ]}
          />
        </>
      );
    }
    render(<Parent />);
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /Duplicar/ })).toHaveFocus();
    act(() => screen.getByRole('button', { name: 'Atualizar' }).click());
    expect(screen.getByRole('menuitem', { name: /Duplicar 1/ })).toHaveFocus();
  });

  it('has no axe violations while open (menu is rendered in a body-level layer)', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={[{ id: 'a', label: 'Editar' }]} />);
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    expect(await axeViolations(screen.getByRole('menu'))).toEqual([]);
  });
});

describe('Combobox sync, form and clearing', () => {
  const options = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
  ];

  it('shows the label when the controlled value changes from outside', () => {
    const { rerender } = render(<Combobox label="Cidade" options={options} value="sp" />);
    expect(screen.getByRole('combobox')).toHaveValue('São Paulo');
    rerender(<Combobox label="Cidade" options={options} value="rj" />);
    expect(screen.getByRole('combobox')).toHaveValue('Rio de Janeiro');
  });

  it('resolves the label when the options arrive after the first render', () => {
    const { rerender } = render(<Combobox label="Cidade" options={[]} value="sp" />);
    expect(screen.getByRole('combobox')).toHaveValue('');
    rerender(<Combobox label="Cidade" options={options} value="sp" />);
    expect(screen.getByRole('combobox')).toHaveValue('São Paulo');
  });

  it('submits the selected value with the form through `name`', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Combobox label="Cidade" options={options} name="cidade" defaultValue="rj" />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).get('cidade')).toBe('rj');
    await user.click(screen.getByRole('button', { name: 'Mostrar opções' }));
    await user.click(screen.getByRole('option', { name: 'São Paulo' }));
    expect(new FormData(form).get('cidade')).toBe('sp');
  });

  it('clears to null with the clear button, by emptying the text and with Escape when closed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox label="Cidade" options={options} defaultValue="sp" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Limpar seleção' }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole('combobox')).toHaveValue('');

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('sp');
    await user.clear(screen.getByRole('combobox'));
    expect(onValueChange).toHaveBeenLastCalledWith(null);

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}{Enter}');
    await user.keyboard('{Escape}');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('names the listbox from the label even when the label is JSX, and has no axe violations without results', async () => {
    const user = userEvent.setup();
    const { container } = render(<Combobox label={<strong>Cidade</strong>} options={options} />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum resultado');
    expect(await axeViolations(container)).toEqual([]);
    await user.clear(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox', { name: 'Cidade' })).toBeInTheDocument();
  });
});

describe('Toast timing', () => {
  function Fire() {
    const { toast } = useToast();
    return (
      <button type="button" onClick={() => toast({ title: 'Salvo', duration: 3000 })}>
        Salvar
      </button>
    );
  }

  it('pauses while hovered, resumes later and dismisses with Escape', async () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Fire />
        </ToastProvider>,
      );
      act(() => screen.getByRole('button', { name: 'Salvar' }).click());
      const item = screen.getByText('Salvo').closest('li') as HTMLElement;
      act(() => {
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseenter'));
      });
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(screen.getByText('Salvo')).toBeInTheDocument();

      act(() => {
        item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      expect(screen.queryByText('Salvo')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the live region reachable while a Dialog makes the page inert', () => {
    render(
      <ToastProvider>
        <Dialog open onOpenChange={() => undefined} title="Modal" />
      </ToastProvider>,
    );
    const region = screen.getByRole('status', { name: 'Notificações' });
    expect(region.closest('[inert]')).toBeNull();
  });
});

describe('Dialog initial focus ref', () => {
  it('focuses the requested element once', () => {
    function Host() {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <Dialog open onOpenChange={() => undefined} title="Confirmar" initialFocusRef={ref}>
          <Button>Primeiro</Button>
          <Button ref={ref}>Cancelar</Button>
        </Dialog>
      );
    }
    render(<Host />);
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
  });
});
