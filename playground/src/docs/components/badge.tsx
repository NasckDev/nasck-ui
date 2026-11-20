import { Badge, type BadgeTone } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { str } from '../shared';

const badgeControls: Control[] = [
  { name: 'children', kind: 'text', default: 'Em revisão' },
  {
    name: 'tone',
    kind: 'select',
    options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    default: 'neutral',
  },
];

export const doc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  group: 'Conteúdo e feedback',
  summary: 'Rótulo estático de status. O significado está no texto, nunca só na cor.',
  semantics: '<span> com data-tone; sem papel ARIA próprio.',
  keyboard: [{ keys: '—', action: 'Não é interativo.' }],
  aria: [
    'Escreva o status por extenso ("Ativo", "Falhou"): cor sozinha não comunica a daltônicos.',
    'Os pares de cor passam em 4,5:1 nos dois temas (veja Tokens).',
  ],
  props: [
    {
      name: 'tone',
      type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'",
      description: 'Cor semântica. Padrão: neutral.',
    },
    {
      name: '...span',
      type: 'ComponentPropsWithoutRef<"span">',
      description: 'Demais props nativas.',
    },
  ],
  demos: [
    {
      title: 'Tons',
      preview: (
        <div className="pg-row">
          <Badge>Rascunho</Badge>
          <Badge tone="accent">Novo</Badge>
          <Badge tone="success">Ativo</Badge>
          <Badge tone="warning">Pendente</Badge>
          <Badge tone="danger">Falhou</Badge>
          <Badge tone="info">Beta</Badge>
        </div>
      ),
      code: `<Badge>Rascunho</Badge>
<Badge tone="success">Ativo</Badge>
<Badge tone="danger">Falhou</Badge>`,
    },
  ],
  playground: {
    controls: badgeControls,
    render: (v) => <Badge tone={v.tone as BadgeTone}>{str(v, 'children') || 'Etiqueta'}</Badge>,
    code: (v) => generateJsx('Badge', badgeControls, v, { childrenKey: 'children' }),
  },
  anatomy: [
    {
      label: 'Etiqueta',
      description: 'Texto em Space Mono; o significado está no texto, não na cor.',
      selector: '.nui-badge',
    },
  ],
  dos: [{ text: 'Use palavras curtas e específicas.', code: '<Badge tone="success">Pago</Badge>' }],
  donts: [
    { text: 'Não dependa só da cor para comunicar o estado.' },
    { text: 'Não use Badge como botão.' },
  ],
};
