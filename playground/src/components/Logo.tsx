interface LogoProps {
  size?: number;
  /** Decorative by default: the adjacent text names it. */
  title?: string;
}

/** Nasck UI mark: an "N" drawn on a square grid cell, with one orange cell as the signature. */
export function LogoMark({ size = 28, title }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" fill="var(--nui-color-text)" />
      <path d="M9 24V8h3.2l7.6 10.2V8H23v16h-3.2L12.2 13.8V24z" fill="var(--nui-color-bg)" />
      <rect x="22" y="3" width="6" height="6" rx="1" fill="#ff5b14" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="pg-logo">
      <LogoMark size={size} />
      <span className="pg-logo__word">
        Nasck<span className="pg-logo__ui"> UI</span>
      </span>
    </span>
  );
}
