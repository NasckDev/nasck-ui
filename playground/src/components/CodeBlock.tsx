import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export const copyText = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context or denied): use the legacy path.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    const previous = document.activeElement as HTMLElement | null;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    previous?.focus();
    return ok;
  }
};

const TOKEN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*'|`[^`]*`)|(<\/?[A-Za-z][\w.]*)|(\b(?:const|let|import|from|export|return|function|true|false|null|undefined|new)\b)|(\b[a-zA-Z-]+(?==))|(--[\w-]+(?=:))/g;

const CLASS_BY_GROUP = ['cm', 'str', 'tag', 'kw', 'attr', 'attr'] as const;

/** Tiny tokenizer: enough for TSX and CSS snippets without shipping a highlighter library. */
export const highlight = (code: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(code.slice(last, index));
    const group = match.findIndex((value, position) => position > 0 && value !== undefined) - 1;
    nodes.push(
      <span key={key++} className={`pg-tok-${CLASS_BY_GROUP[group] ?? 'kw'}`}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
};

interface CodeBlockProps {
  code: string;
  label: string;
  lang?: string;
}

export function CodeBlock({ code, label, lang = 'tsx' }: CodeBlockProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    const ok = await copyText(code);
    setStatus(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="pg-code">
      <div className="pg-code__bar">
        <span className="pg-code__lang">{lang}</span>
        <button
          type="button"
          className="pg-code__copy nui-focusable"
          onClick={handleCopy}
          aria-label={`Copiar código: ${label}`}
          data-status={status}
        >
          {status === 'copied' ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
          {status === 'copied' ? 'Copiado' : status === 'failed' ? 'Falhou' : 'Copiar'}
        </button>
        <span className="nui-visually-hidden" role="status">
          {status === 'copied'
            ? 'Código copiado'
            : status === 'failed'
              ? 'Não foi possível copiar'
              : ''}
        </span>
      </div>
      {/* Focusable so keyboard users can scroll long lines. */}
      <pre className="pg-code__pre" tabIndex={0} aria-label={`Código: ${label}`}>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}
