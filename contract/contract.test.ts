import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { ICON_NAMES } from '../packages/tokens/src/models.ts';
import contract from './contract.json' with { type: 'json' };

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const REACT_DIR = join(ROOT, 'packages/react/src/ui');
const ANGULAR_DIR = join(ROOT, 'packages/angular/src/ui');

interface ContractEntry {
  selector: string;
  props: string[];
  events: Record<string, string>;
}
const components = contract.components as Record<string, ContractEntry>;

function sources(dir: string, pattern: RegExp): ts.SourceFile[] {
  return readdirSync(dir)
    .filter((file) => pattern.test(file) && !file.includes('.stories.') && !file.includes('.test.'))
    .map((file) => {
      const path = join(dir, file);
      return ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.ES2022, true);
    });
}

function walk(node: ts.Node, visit: (child: ts.Node) => void): void {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

/** Props de React: membros de `interface <Nome>Props`. */
function reactProps(files: ts.SourceFile[]): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const file of files) {
    walk(file, (node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
        const names = node.members
          .filter(ts.isPropertySignature)
          .map((member) => member.name.getText(file));
        result.set(node.name.text.replace(/Props$/, ''), names);
      }
    });
  }
  return result;
}

interface AngularApi {
  selector: string;
  inputs: string[];
  outputs: string[];
}

function calleeName(expression: ts.Expression): string {
  return expression.getText();
}

/** Inputs e outputs de Angular: input(), input.required(), model(), output() e @Output(). */
function angularApis(files: ts.SourceFile[]): Map<string, AngularApi> {
  const result = new Map<string, AngularApi>();
  for (const file of files) {
    walk(file, (node) => {
      if (!ts.isClassDeclaration(node) || !node.name?.text.endsWith('Component')) return;
      const api: AngularApi = { selector: '', inputs: [], outputs: [] };
      const decorators = ts.getDecorators(node) ?? [];
      for (const decorator of decorators) {
        const text = decorator.expression.getText(file);
        const match = /selector:\s*'([^']+)'/.exec(text);
        if (match?.[1]) api.selector = match[1];
      }
      for (const member of node.members) {
        if (!ts.isPropertyDeclaration(member)) continue;
        const name = member.name.getText(file);
        const memberDecorators = ts.canHaveDecorators(member)
          ? (ts.getDecorators(member) ?? [])
          : [];
        if (memberDecorators.some((d) => d.expression.getText(file).startsWith('Output'))) {
          api.outputs.push(name);
          continue;
        }
        const init = member.initializer;
        if (!init || !ts.isCallExpression(init)) continue;
        const callee = calleeName(init.expression);
        if (callee === 'input' || callee === 'input.required') api.inputs.push(name);
        else if (callee === 'model' || callee === 'model.required') {
          api.inputs.push(name);
          api.outputs.push(`${name}Change`);
        } else if (callee === 'output') api.outputs.push(name);
      }
      result.set(node.name.text.replace(/Component$/, ''), api);
    });
  }
  return result;
}

const react = reactProps(sources(REACT_DIR, /\.tsx$/));
const angular = angularApis(sources(ANGULAR_DIR, /\.ts$/));
const sorted = (values: string[]): string[] => [...values].sort();

describe('contrato Nasck UI: React e Angular expoem a mesma API', () => {
  it('lista os componentes do contrato nos dois pacotes', () => {
    const names = Object.keys(components);
    expect(names.length).toBeGreaterThanOrEqual(27);
    expect(names.filter((name) => !react.has(name))).toEqual([]);
    expect(names.filter((name) => !angular.has(name))).toEqual([]);
  });

  for (const [name, entry] of Object.entries(components)) {
    describe(name, () => {
      it('React: props iguais ao contrato', () => {
        const members = react.get(name) ?? [];
        const props = members.filter((member) => !/^on[A-Z]/.test(member) && member !== 'children');
        expect(sorted(props)).toEqual(sorted(entry.props));
      });

      it('React: eventos iguais ao contrato', () => {
        const members = react.get(name) ?? [];
        const events = members.filter((member) => /^on[A-Z]/.test(member));
        expect(sorted(events)).toEqual(sorted(Object.keys(entry.events)));
      });

      it('Angular: inputs iguais ao contrato', () => {
        expect(sorted(angular.get(name)?.inputs ?? [])).toEqual(sorted(entry.props));
      });

      it('Angular: outputs iguais ao contrato', () => {
        expect(sorted(angular.get(name)?.outputs ?? [])).toEqual(
          sorted(Object.values(entry.events)),
        );
      });

      it('Angular: seletor igual ao contrato', () => {
        expect(angular.get(name)?.selector).toBe(entry.selector);
      });
    });
  }

  it('os icones do contrato sao os mesmos do pacote de tokens', () => {
    expect(sorted(contract.icons)).toEqual(sorted([...ICON_NAMES]));
  });
});
