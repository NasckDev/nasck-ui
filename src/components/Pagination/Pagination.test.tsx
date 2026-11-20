import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axeViolations } from '../../test/axe';
import { Pagination, getPageItems } from './Pagination';

describe('getPageItems', () => {
  it('lists every page when there are few', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses the end, the start and both sides with ellipses', () => {
    expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
    expect(getPageItems(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });
});

function Harness({ count = 12 }: { count?: number }) {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={count} onPageChange={setPage} />;
}

describe('Pagination', () => {
  it('is a labelled navigation and marks the current page', () => {
    render(<Harness />);
    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('goes to the next and previous pages with Enter and disables the ends', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('button', { name: /Anterior/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    screen.getByRole('button', { name: /Próxima/ }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await user.click(screen.getByRole('button', { name: /Anterior/ }));
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('jumps to a page by Tab and Space', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Página 12' }));
    expect(screen.getByRole('button', { name: /Próxima/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Página 12' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
