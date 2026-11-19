import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button/Button';
import { Dialog } from './Dialog';

function Harness({ withInitialFocus = false }: { withInitialFocus?: boolean }) {
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Excluir projeto"
        description="Essa ação não pode ser desfeita."
        initialFocusRef={withInitialFocus ? confirmRef : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button ref={confirmRef} variant="danger">
              Excluir
            </Button>
          </>
        }
      >
        Conteúdo
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a labelled modal and focuses the first focusable element', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Abrir' }));

    const dialog = await screen.findByRole('dialog', { name: 'Excluir projeto' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Essa ação não pode ser desfeita.');
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
  });

  it('honors initialFocusRef', async () => {
    const user = userEvent.setup();
    render(<Harness withInitialFocus />);

    await user.click(screen.getByRole('button', { name: 'Abrir' }));

    expect(await screen.findByRole('button', { name: 'Excluir' })).toHaveFocus();
  });

  it('traps Tab and Shift+Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await screen.findByRole('dialog');

    // order: Fechar, Cancelar, Excluir
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveFocus();
  });

  it('makes the page inert while open and restores it on close', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await screen.findByRole('dialog');

    expect(container).toHaveAttribute('inert');

    await user.keyboard('{Escape}');
    expect(container).not.toHaveAttribute('inert');
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });
    await user.click(trigger);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes with the close button and with an overlay click, but not on dialog click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Abrir' });

    await user.click(trigger);
    await user.click(await screen.findByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await user.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const overlay = dialog.parentElement as HTMLElement;
    await user.pointer({ keys: '[MouseLeft]', target: overlay });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports alertdialog and a custom close label', async () => {
    render(
      <Dialog
        open
        onOpenChange={() => undefined}
        title="Confirmar"
        role="alertdialog"
        closeLabel="Dismiss"
      />,
    );
    expect(await screen.findByRole('alertdialog', { name: 'Confirmar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = await screen.findByRole('dialog');
    expect(await axeViolations(dialog)).toEqual([]);
  });
});
