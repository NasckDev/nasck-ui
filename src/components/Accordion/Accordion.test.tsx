import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Accordion, nextHeaderIndex, type AccordionItem } from './Accordion';

const items: AccordionItem[] = [
  { id: 'a', title: 'Faturamento', content: 'Texto A' },
  { id: 'b', title: 'Segurança', content: 'Texto B', disabled: true },
  { id: 'c', title: 'Equipe', content: 'Texto C' },
];

describe('Accordion', () => {
  it('starts collapsed with aria-expanded and aria-controls wired', () => {
    render(<Accordion items={items} />);
    const button = screen.getByRole('button', { name: 'Faturamento' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button.getAttribute('aria-controls')).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('opens with Enter and Space and closes again', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const button = screen.getByRole('button', { name: 'Faturamento' });
    button.focus();

    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Faturamento' })).toBeInTheDocument();

    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps one panel open at a time by default and many with `multiple`', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Accordion items={items} />);
    await user.click(screen.getByRole('button', { name: 'Faturamento' }));
    await user.click(screen.getByRole('button', { name: 'Equipe' }));
    expect(screen.getByRole('button', { name: 'Faturamento' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Equipe' })).toHaveAttribute('aria-expanded', 'true');

    rerender(<Accordion key="m" items={items} multiple />);
    await user.click(screen.getByRole('button', { name: 'Faturamento' }));
    await user.click(screen.getByRole('button', { name: 'Equipe' }));
    expect(screen.getByRole('button', { name: 'Faturamento' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Equipe' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves between headers with arrows, Home and End, skipping disabled ones', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    screen.getByRole('button', { name: 'Faturamento' }).focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Equipe' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Faturamento' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Equipe' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'Faturamento' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Equipe' })).toHaveFocus();
  });

  it('notifies changes when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Accordion items={items} value={[]} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button', { name: 'Equipe' }));
    expect(onValueChange).toHaveBeenCalledWith(['c']);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Accordion items={items} defaultValue={['a']} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('nextHeaderIndex', () => {
  it('returns the current index when nothing is enabled', () => {
    expect(nextHeaderIndex([{ id: 'x', title: 'x', content: '', disabled: true }], 0, 'End')).toBe(
      0,
    );
  });
});
