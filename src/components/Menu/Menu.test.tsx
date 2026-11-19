import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axeViolations } from '../../test/axe';
import { Menu, findByTypeahead, nextMenuIndex, type MenuItem } from './Menu';

const build = (onSelect = vi.fn()): MenuItem[] => [
  { id: 'edit', label: 'Editar', onSelect },
  { id: 'copy', label: 'Duplicar', onSelect },
  { id: 'lock', label: 'Arquivar', disabled: true },
  { id: 'del', label: 'Excluir', tone: 'danger', separatorBefore: true, onSelect },
];

describe('Menu', () => {
  it('is closed by default and exposes menu-button semantics', () => {
    render(<Menu label="Ações" items={build()} />);
    const trigger = screen.getByRole('button', { name: 'Ações' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens with Enter and focuses the first item', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    screen.getByRole('button', { name: 'Ações' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Ações' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens on the last item with ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    screen.getByRole('button', { name: 'Ações' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
  });

  it('navigates with arrows, skipping disabled items, wrapping and using Home/End', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    screen.getByRole('button', { name: 'Ações' }).focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus();
  });

  it('jumps to an item by typing its first letter', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    screen.getByRole('button', { name: 'Ações' }).focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('e');
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toHaveFocus();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    const trigger = screen.getByRole('button', { name: 'Ações' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Tab without trapping focus', async () => {
    const user = userEvent.setup();
    render(<Menu label="Ações" items={build()} />);
    screen.getByRole('button', { name: 'Ações' }).focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Tab}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('runs onSelect, closes and restores focus when an item is activated', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Menu label="Ações" items={build(onSelect)} />);
    const trigger = screen.getByRole('button', { name: 'Ações' });
    trigger.focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('does not activate disabled items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const items: MenuItem[] = [{ id: 'x', label: 'Arquivar', disabled: true, onSelect }];
    render(<Menu label="Ações" items={items} />);
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    await user.click(screen.getByRole('menuitem', { name: 'Arquivar' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Menu label="Ações" items={build()} />
        <p>fora</p>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByText('fora'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports an icon-only trigger named by label', () => {
    render(<Menu label="Mais ações" iconOnly icon={<svg />} items={build()} />);
    expect(screen.getByRole('button', { name: 'Mais ações' })).toBeInTheDocument();
  });

  it('has no axe violations open or closed', async () => {
    const user = userEvent.setup();
    const { container } = render(<Menu label="Ações" items={build()} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Ações' }));
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('menu helpers', () => {
  it('nextMenuIndex returns -1 when all items are disabled', () => {
    expect(nextMenuIndex([{ id: 'a', label: 'a', disabled: true }], 0, 1)).toBe(-1);
  });

  it('findByTypeahead matches case-insensitively and skips disabled items', () => {
    const items = build();
    expect(findByTypeahead(items, 'D', -1)).toBe(1);
    expect(findByTypeahead(items, 'arq', -1)).toBe(-1);
    expect(findByTypeahead(items, 'zzz', -1)).toBe(-1);
  });
});
