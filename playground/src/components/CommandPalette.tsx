import { CornerDownLeft } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { normalizeText } from '../../../src/components/Combobox/Combobox';
import type { NavEntry } from '../nav';

interface CommandPaletteProps {
  open: boolean;
  entries: readonly NavEntry[];
  onClose: () => void;
  onNavigate: (to: string) => void;
}

const MAX_RESULTS = 12;

/** Ranks entries: label prefix, then label contains, then keywords contain. */
export const searchEntries = (entries: readonly NavEntry[], query: string): NavEntry[] => {
  const needle = normalizeText(query.trim());
  if (!needle) return entries.slice(0, MAX_RESULTS);
  const scored = entries
    .map((entry) => {
      const label = normalizeText(entry.label);
      const rank = label.startsWith(needle)
        ? 0
        : label.includes(needle)
          ? 1
          : normalizeText(`${entry.keywords} ${entry.group}`).includes(needle)
            ? 2
            : -1;
      return { entry, rank };
    })
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => a.rank - b.rank);
  return scored.slice(0, MAX_RESULTS).map(({ entry }) => entry);
};

/** Ctrl/⌘+K search: a combobox in a modal dialog. Focus stays in the input. */
export function CommandPalette({ open, entries, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => searchEntries(entries, query), [entries, query]);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement as HTMLElement | null;
    const shell = document.getElementById('app-shell');
    shell?.setAttribute('inert', '');
    inputRef.current?.focus();
    return () => {
      shell?.removeAttribute('inert');
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const choose = (entry: NavEntry | undefined) => {
    if (!entry) return;
    onNavigate(entry.to);
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return createPortal(
    // The overlay closes on outside click; keyboard users close with Esc inside the input.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="pg-palette__overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar na documentação"
        className="pg-palette"
      >
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
          aria-label="Buscar componentes, tokens e modelos"
          className="pg-palette__input"
          placeholder="Buscar componentes, tokens e modelos…"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
        />
        <ul id={listId} role="listbox" aria-label="Resultados" className="pg-palette__list">
          {results.map((entry, index) => {
            const Icon = entry.icon;
            return (
              // Options follow aria-activedescendant on the input; click is a pointer shortcut.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={entry.to}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                className="pg-palette__option"
                onMouseMove={() => setActive(index)}
                onClick={() => choose(entry)}
              >
                <Icon size={16} aria-hidden="true" />
                <span className="pg-palette__label">{entry.label}</span>
                <span className="pg-palette__group">{entry.group}</span>
                {index === active ? <CornerDownLeft size={14} aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ul>
        {results.length === 0 ? (
          <p className="pg-palette__empty">
            Nada encontrado para “{query}”. Tente “botão”, “tema” ou “tabela”.
          </p>
        ) : null}
        <p className="nui-visually-hidden" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
        </p>
        <footer className="pg-palette__foot">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> navegar
          </span>
          <span>
            <kbd>Enter</kbd> abrir
          </span>
          <span>
            <kbd>Esc</kbd> fechar
          </span>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
