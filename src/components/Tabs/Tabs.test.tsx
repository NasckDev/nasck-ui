import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axeViolations } from '../../test/axe';
import { Tabs, nextEnabledIndex, type TabItem } from './Tabs';

const items: TabItem[] = [
  { id: 'a', label: 'Visão geral', content: 'Painel A' },
  { id: 'b', label: 'Atividade', content: 'Painel B', disabled: true },
  { id: 'c', label: 'Ajustes', content: 'Painel C' },
];

describe('Tabs', () => {
  it('selects the first enabled tab and exposes tab semantics', () => {
    render(<Tabs label="Seções" items={items} />);

    expect(screen.getByRole('tablist', { name: 'Seções' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Ajustes' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel A');
  });

  it('moves with arrow keys skipping disabled tabs and wrapping around', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" items={items} />);
    screen.getByRole('tab', { name: 'Visão geral' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Ajustes' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel C');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Ajustes' })).toHaveFocus();
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" items={items} defaultValue="c" />);
    screen.getByRole('tab', { name: 'Ajustes' }).focus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Ajustes' })).toHaveFocus();
  });

  it('ignores unrelated keys and does not select disabled tabs by click', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" items={items} />);
    screen.getByRole('tab', { name: 'Visão geral' }).focus();

    await user.keyboard('x');
    await user.click(screen.getByRole('tab', { name: 'Atividade' }));

    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('a');
      return (
        <Tabs
          label="Seções"
          items={items}
          value={value}
          onValueChange={(id) => {
            onValueChange(id);
            setValue(id);
          }}
        />
      );
    }
    render(<Controlled />);

    await user.click(screen.getByRole('tab', { name: 'Ajustes' }));

    expect(onValueChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel C');
  });

  it('links each tab to its panel', () => {
    render(<Tabs label="Seções" items={items} />);
    const tab = screen.getByRole('tab', { name: 'Visão geral' });
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', tab.getAttribute('aria-controls'));
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Visão geral');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Tabs label="Seções" items={items} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('nextEnabledIndex', () => {
  it('returns the current index when every tab is disabled', () => {
    const disabled = items.map((item) => ({ ...item, disabled: true }));
    expect(nextEnabledIndex(disabled, 1, 'ArrowRight')).toBe(1);
  });
});
