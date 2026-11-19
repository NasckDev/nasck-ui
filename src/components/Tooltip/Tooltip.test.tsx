import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('is hidden by default and linked to the trigger with aria-describedby', () => {
    render(
      <Tooltip content="Salva o rascunho">
        <Button>Salvar</Button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Salvar' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    expect(tooltip).not.toBeVisible();
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('shows on keyboard focus and hides on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Salva o rascunho">
          <Button>Salvar</Button>
        </Tooltip>
        <Button>Outro</Button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Salva o rascunho');

    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on hover and hides on mouse leave', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Salva o rascunho">
        <Button>Salvar</Button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Salvar' });

    await user.hover(button);
    expect(screen.getByRole('tooltip')).toBeVisible();

    await user.unhover(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes with Escape while keeping focus on the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Salva o rascunho">
        <Button>Salvar</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeVisible();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveFocus();
  });

  it('preserves an existing aria-describedby on the trigger and sets placement', () => {
    render(
      <>
        <p id="dica">Dica</p>
        <Tooltip content="Mais" placement="bottom">
          <Button aria-describedby="dica">Salvar</Button>
        </Tooltip>
      </>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute(
      'aria-describedby',
      `dica ${tooltip.id}`,
    );
    expect(tooltip).toHaveAttribute('data-placement', 'bottom');
  });

  it('has no axe violations while shown', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content="Salva o rascunho">
        <Button>Salvar</Button>
      </Tooltip>,
    );
    await user.tab();
    expect(await axeViolations(container)).toEqual([]);
  });
});
