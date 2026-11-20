import { resolve } from 'node:path';
import ts from 'typescript';
import { docMetas, loadDoc } from '../docs';
import { defaultValues } from './codegen';
import { buildSnippet } from './snippet';

const ROOT = resolve(process.cwd());

interface NamedSnippet {
  name: string;
  source: string;
}

const collectSnippets = async (): Promise<NamedSnippet[]> => {
  const snippets: NamedSnippet[] = [];
  for (const meta of docMetas) {
    const doc = await loadDoc(meta.slug);
    if (!doc) throw new Error(`doc ${meta.slug} did not load`);
    doc.demos.forEach((demo, index) => {
      snippets.push({
        name: `${meta.slug}-demo-${index}`,
        source: buildSnippet({ code: demo.code, setup: demo.setup }),
      });
    });
    if (doc.playground) {
      const values = defaultValues(doc.playground.controls);
      snippets.push({
        name: `${meta.slug}-playground`,
        source: buildSnippet({
          code: doc.playground.code(values),
          setup: doc.playground.setup?.(values),
        }),
      });
      // The first option of every select, and every boolean flipped: still valid code.
      doc.playground.controls.forEach((control, index) => {
        if (control.kind === 'boolean') {
          snippets.push({
            name: `${meta.slug}-playground-${control.name}`,
            source: buildSnippet({
              code: doc.playground!.code({ ...values, [control.name]: !control.default }),
              setup: doc.playground!.setup?.({ ...values, [control.name]: !control.default }),
            }),
          });
        } else if (control.kind === 'select') {
          control.options.forEach((option) => {
            snippets.push({
              name: `${meta.slug}-playground-${index}-${option}`,
              source: buildSnippet({
                code: doc.playground!.code({ ...values, [control.name]: option }),
                setup: doc.playground!.setup?.({ ...values, [control.name]: option }),
              }),
            });
          });
        }
      });
    }
  }
  return snippets;
};

/** Type-checks every snippet against the real library types, the way a consumer would. */
const typeCheck = (snippets: NamedSnippet[]): string[] => {
  const virtual = new Map(
    snippets.map(({ name, source }) => [
      resolve(ROOT, 'playground/src/__snippets__', `${name}.tsx`),
      source,
    ]),
  );
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    types: [],
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
    baseUrl: ROOT,
    paths: { '@nasckdev/nasck-ui': ['src/index.ts'] },
  };
  const host = ts.createCompilerHost(options);
  const original = {
    getSourceFile: host.getSourceFile.bind(host),
    fileExists: host.fileExists.bind(host),
    readFile: host.readFile.bind(host),
  };
  host.fileExists = (file) => virtual.has(resolve(file)) || original.fileExists(file);
  host.readFile = (file) => virtual.get(resolve(file)) ?? original.readFile(file);
  host.getSourceFile = (file, languageVersion, onError, shouldCreate) => {
    const text = virtual.get(resolve(file));
    return text === undefined
      ? original.getSourceFile(file, languageVersion, onError, shouldCreate)
      : ts.createSourceFile(file, text, languageVersion, true, ts.ScriptKind.TSX);
  };
  const program = ts.createProgram([...virtual.keys()], options, host);
  const problems: string[] = [];
  for (const file of virtual.keys()) {
    const sourceFile = program.getSourceFile(file);
    if (!sourceFile) continue;
    const diagnostics = [
      ...program.getSyntacticDiagnostics(sourceFile),
      ...program.getSemanticDiagnostics(sourceFile),
    ];
    diagnostics.forEach((diagnostic) => {
      problems.push(
        `${file.split(/[\\/]/).pop()}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
      );
    });
  }
  return problems;
};

describe('copyable snippets', () => {
  it('wraps statements, imports and data into a complete example', () => {
    const source = buildSnippet({
      code: 'const [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>Abrir</Button>',
    });
    expect(source).toContain("import { useState } from 'react';");
    expect(source).toContain("import { Button } from '@nasckdev/nasck-ui';");
    expect(source).toContain('export function Example() {');
    expect(source).toContain('const [open, setOpen] = useState(false);');
  });

  it('adds the ToastProvider to snippets that use the toast hook', () => {
    const source = buildSnippet({
      code: 'const { toast } = useToast();\n\n<Button onClick={() => toast({ title: "ok" })}>Ok</Button>',
    });
    expect(source).toContain('ToastProvider');
    expect(source).toContain('export default function App()');
  });

  it('every demo and every playground state compiles against the real library', async () => {
    const snippets = await collectSnippets();
    expect(snippets.length).toBeGreaterThan(60);
    expect(typeCheck(snippets)).toEqual([]);
  }, 600_000);
});
