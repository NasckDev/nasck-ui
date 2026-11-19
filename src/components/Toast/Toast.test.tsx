import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button/Button';
import { DEFAULT_TOAST_DURATION, ToastProvider, useToast, type ToastOptions } from './Toast';

function Trigger({ options }: { options: ToastOptions }) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>Notificar</Button>;
}

const setup = (options: ToastOptions) =>
  render(
    <ToastProvider>
      <Trigger options={options} />
    </ToastProvider>,
  );

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps a polite live region mounted before any toast', () => {
    setup({ title: 'Salvo' });
    const region = screen.getByRole('status', { name: 'Notificações' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByText('Salvo')).not.toBeInTheDocument();
  });

  it('announces a toast inside the region without moving focus', async () => {
    const user = userEvent.setup();
    setup({ title: 'Salvo', description: 'Alterações gravadas.', tone: 'success' });
    const trigger = screen.getByRole('button', { name: 'Notificar' });

    await user.click(trigger);

    const region = screen.getByRole('status');
    expect(region).toHaveTextContent('Salvo');
    expect(region).toHaveTextContent('Alterações gravadas.');
    expect(trigger).toHaveFocus();
  });

  it('dismisses with the dismiss button via keyboard', async () => {
    const user = userEvent.setup();
    setup({ title: 'Salvo', duration: null });
    await user.click(screen.getByRole('button', { name: 'Notificar' }));

    await user.tab();
    expect(screen.getByRole('button', { name: 'Dispensar notificação' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(screen.queryByText('Salvo')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the default duration', () => {
    vi.useFakeTimers();
    setup({ title: 'Some sozinho' });
    act(() => {
      screen.getByRole('button', { name: 'Notificar' }).click();
    });
    expect(screen.getByText('Some sozinho')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TOAST_DURATION + 1);
    });

    expect(screen.queryByText('Some sozinho')).not.toBeInTheDocument();
  });

  it('keeps the toast when duration is null', () => {
    vi.useFakeTimers();
    setup({ title: 'Fica', duration: null });
    act(() => {
      screen.getByRole('button', { name: 'Notificar' }).click();
    });

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TOAST_DURATION * 4);
    });

    expect(screen.getByText('Fica')).toBeInTheDocument();
  });

  it('throws a helpful error outside the provider', () => {
    // React logs the thrown error; silence it for a clean test output.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it('has no axe violations with a toast showing', async () => {
    const user = userEvent.setup();
    const { container } = setup({ title: 'Salvo', description: 'Ok', duration: null });
    await user.click(screen.getByRole('button', { name: 'Notificar' }));
    expect(await axeViolations(container)).toEqual([]);
  });
});
