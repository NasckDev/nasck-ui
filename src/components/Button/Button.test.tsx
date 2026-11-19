import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { IconButton } from '../IconButton/IconButton';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with type="button" by default', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'button');
  });

  it('activates with mouse, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });

    await user.click(button);
    await user.tab();
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('stays focusable but ignores clicks while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    );
    const button = screen.getByRole('button', { name: /Enviar/ });

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAccessibleName('Enviar Carregando');
  });

  it('does not fire when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes variant and size for styling', () => {
    render(
      <Button variant="danger" size="lg" startIcon={<span>i</span>}>
        Excluir
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('has no axe violations in every state', async () => {
    const { container } = render(
      <>
        <Button>Primário</Button>
        <Button variant="secondary" disabled>
          Desabilitado
        </Button>
        <Button loading>Carregando</Button>
      </>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('IconButton', () => {
  it('uses the label as accessible name and hides the icon', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<IconButton label="Fechar" icon="✕" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Fechar' });

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(button.querySelector('[aria-hidden="true"]')).toHaveTextContent('✕');
    expect(await axeViolations(container)).toEqual([]);
  });
});
