import type { Meta, StoryObj } from '@storybook/angular';

/**
 * Monta o template de uma story a partir do seletor e das listas de inputs e outputs,
 * ligando cada um ao arg de mesmo nome. `content` e o conteudo projetado.
 */
export function template(
  selector: string,
  inputs: readonly string[],
  outputs: readonly string[] = [],
  content = '',
): string {
  const bindings = [
    ...inputs.map((name) => `[${name}]="${name}"`),
    ...outputs.map((name) => `(${name})="${name}($event)"`),
  ].join(' ');
  return `<${selector} ${bindings}>${content}</${selector}>`;
}

export type Story<T> = StoryObj<T>;
export type { Meta };
