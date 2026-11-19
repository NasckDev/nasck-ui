import { useEffect, useRef, useState } from 'react';
import { Button } from '../../src';

const copyText = async (text: string): Promise<boolean> => {
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
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
};

export function CodeBlock({ code, label }: { code: string; label: string }) {
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
        <span className="pg-code__lang">tsx</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={`Copiar código: ${label}`}
        >
          {status === 'copied' ? 'Copiado' : status === 'failed' ? 'Falhou' : 'Copiar'}
        </Button>
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
        <code>{code}</code>
      </pre>
    </div>
  );
}
