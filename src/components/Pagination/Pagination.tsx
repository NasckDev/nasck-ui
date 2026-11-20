import { cx } from '../../utils/cx';
import './Pagination.css';

export interface PaginationProps {
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. Defaults to 1. */
  siblingCount?: number;
  /** Accessible name of the navigation landmark. */
  label?: string;
  className?: string;
}

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Pages to render: always first and last, a window around `page`, and ellipses for the gaps. */
export const getPageItems = (page: number, pageCount: number, siblingCount = 1): PageItem[] => {
  const total = siblingCount * 2 + 5;
  const range = (from: number, to: number): number[] =>
    Array.from({ length: to - from + 1 }, (_, index) => from + index);
  if (pageCount <= total) return range(1, pageCount);

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showStart = left > 3;
  const showEnd = right < pageCount - 2;
  const edge = siblingCount * 2 + 3;

  if (!showStart && showEnd) return [...range(1, edge), 'ellipsis-end', pageCount];
  if (showStart && !showEnd)
    return [1, 'ellipsis-start', ...range(pageCount - edge + 1, pageCount)];
  return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', pageCount];
};

/** Page navigation. The current page is marked with `aria-current="page"`. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  label = 'Paginação',
  className,
}: PaginationProps) {
  const items = getPageItems(page, pageCount, siblingCount);
  const go = (next: number) => onPageChange(Math.min(Math.max(next, 1), pageCount));

  return (
    <nav aria-label={label} className={cx('nui-pagination', className)}>
      <span className="nui-visually-hidden" role="status" aria-live="polite">
        Página {page} de {pageCount}
      </span>
      <ul className="nui-pagination__list">
        <li>
          <button
            type="button"
            className="nui-pagination__button nui-pagination__step nui-focusable"
            aria-disabled={page <= 1 || undefined}
            onClick={() => page > 1 && go(page - 1)}
          >
            <span aria-hidden="true">←</span> Anterior
          </button>
        </li>
        {items.map((item) =>
          typeof item === 'string' ? (
            <li key={item} className="nui-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className="nui-pagination__button nui-focusable"
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="nui-pagination__button nui-pagination__step nui-focusable"
            aria-disabled={page >= pageCount || undefined}
            onClick={() => page < pageCount && go(page + 1)}
          >
            Próxima <span aria-hidden="true">→</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
