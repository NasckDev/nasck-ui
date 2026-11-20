import * as library from '../../../src';

/** Runtime exports of the library: components and hooks that can appear in a snippet. */
const LIBRARY_NAMES = Object.keys(library).filter((name) => name !== 'tokens');

/** Types the docs use in snippets (type-only imports). */
const TYPE_NAMES = [
  'TableColumn',
  'MenuItem',
  'ComboboxOption',
  'SelectOption',
  'TabItem',
  'AccordionItem',
];

const LUCIDE_NAMES = ['Plus', 'Trash2', 'Pencil', 'Copy', 'Download', 'Inbox', 'Info'];

const PACKAGE = '@nasckdev/nasck-ui';

export interface SnippetInput {
  /** JSX, optionally preceded by statements (hooks, handlers). */
  code: string;
  /** Data the code needs (arrays, interfaces), placed above the component. */
  setup?: string;
}

const isComponent = (name: string): boolean => /^[A-Z]/.test(name);

const usesName = (text: string, name: string): boolean =>
  isComponent(name)
    ? new RegExp(`<${name}(?=[\\s/>.])`).test(text)
    : new RegExp(`\\b${name}(?=[<(])`).test(text);

const declaredIn = (text: string, name: string): boolean =>
  new RegExp(`(?:const|function|interface|type|class)\\s+${name}\\b`).test(text);

const indent = (text: string, spaces: number): string =>
  text
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : line))
    .join('\n');

/** Splits "statements then JSX" at the first line that starts a JSX element. */
const splitStatementsAndJsx = (code: string): { statements: string; jsx: string } => {
  const lines = code.trim().split('\n');
  const start = lines.findIndex((line) => /^\s*</.test(line) && !/^\s*<\//.test(line));
  if (start <= 0) return { statements: '', jsx: lines.join('\n') };
  // Comments right before the JSX belong to the statements block.
  return {
    statements: lines.slice(0, start).join('\n').trim(),
    jsx: lines.slice(start).join('\n'),
  };
};

const rootCount = (jsx: string): number =>
  jsx.split('\n').filter((line) => /^<(?!\/)/.test(line)).length;

/** Builds a complete, copy-pasteable example: imports, data, and an `Example` component. */
export const buildSnippet = ({ code, setup = '' }: SnippetInput): string => {
  const text = `${setup}\n${code}`;
  const { statements, jsx } = splitStatementsAndJsx(code);
  const needsToast = usesName(text, 'useToast');

  const libraryImports = LIBRARY_NAMES.filter(
    (name) => usesName(text, name) && !declaredIn(setup, name),
  );
  if (needsToast && !libraryImports.includes('ToastProvider')) libraryImports.push('ToastProvider');
  const typeImports = TYPE_NAMES.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
  const reactImports = ['useRef', 'useState'].filter((name) => usesName(text, name));
  const icons = LUCIDE_NAMES.filter((name) => usesName(text, name));

  const imports = [
    reactImports.length ? `import { ${reactImports.join(', ')} } from 'react';` : '',
    icons.length ? `import { ${icons.join(', ')} } from 'lucide-react';` : '',
    `import { ${[...libraryImports.sort(), ...typeImports.sort().map((name) => `type ${name}`)].join(', ')} } from '${PACKAGE}';`,
  ].filter(Boolean);

  const wrapped = rootCount(jsx) > 1 ? `<>\n${indent(jsx, 2)}\n</>` : jsx;
  const body = [
    statements ? `${indent(statements, 2)}\n` : '',
    `  return (\n${indent(wrapped, 4)}\n  );`,
  ].join('\n');

  const parts = [
    imports.join('\n'),
    setup.trim(),
    `export function Example() {\n${body.replace(/^\n/, '')}\n}`,
  ].filter(Boolean);

  if (needsToast) {
    parts.push(
      'export default function App() {\n  return (\n    <ToastProvider>\n      <Example />\n    </ToastProvider>\n  );\n}',
    );
  }
  return `${parts.join('\n\n')}\n`;
};
