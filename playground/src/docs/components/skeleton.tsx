import { Skeleton } from '../../../../src';
import { type ComponentDoc, type Control } from '../types';
import { str } from '../shared';

const skeletonControls: Control[] = [
  { name: 'shape', kind: 'select', options: ['text', 'rect', 'circle'], default: 'text' },
  { name: 'lines', kind: 'select', options: ['1', '2', '3', '4'], default: '3' },
  { name: 'width', kind: 'text', default: '' },
  { name: 'height', kind: 'text', default: '' },
];

const dimension = (value: string): string | number | undefined =>
  value === '' ? undefined : /^\d+$/.test(value) ? Number(value) : value;

export const doc: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  group: 'Conteúdo e feedback',
  summary: 'Marcador de carregamento. Decorativo: quem anuncia o carregamento é o contêiner.',
  semantics: 'aria-hidden="true"; o contêiner usa aria-busy.',
  keyboard: [{ keys: '—', action: 'Não é interativo.' }],
  aria: [
    'Skeleton é aria-hidden. Marque o contêiner com aria-busy="true" e inclua um texto de status oculto.',
    'A animação respeita prefers-reduced-motion (durações vão a 0ms).',
  ],
  props: [
    { name: 'shape', type: "'text' | 'rect' | 'circle'", description: 'Formato. Padrão: text.' },
    {
      name: 'lines',
      type: 'number',
      description: 'Linhas de texto; a última tem 60% da largura.',
    },
    { name: 'width / height', type: 'CSSProperties', description: 'Dimensões.' },
  ],
  demos: [
    {
      title: 'Carregando um perfil',
      note: 'O contêiner anuncia aria-busy; os blocos são decorativos.',
      preview: (
        <div className="pg-skeleton-demo" aria-busy="true">
          <span className="nui-visually-hidden">Carregando perfil</span>
          <Skeleton shape="circle" width={48} height={48} />
          <div className="pg-skeleton-demo__text">
            <Skeleton width="40%" />
            <Skeleton lines={3} />
          </div>
        </div>
      ),
      code: `<div aria-busy="true">
  <span className="nui-visually-hidden">Carregando perfil</span>
  <Skeleton shape="circle" width={48} height={48} />
  <Skeleton width="40%" />
  <Skeleton lines={3} />
</div>`,
    },
  ],
  playground: {
    controls: skeletonControls,
    render: (v) => (
      <div aria-busy="true" style={{ width: '16rem' }}>
        <Skeleton
          shape={v.shape as 'text'}
          lines={Number(v.lines)}
          width={dimension(str(v, 'width'))}
          height={dimension(str(v, 'height'))}
        />
        <span className="nui-visually-hidden">Carregando</span>
      </div>
    ),
    code: (v) =>
      [
        '<div aria-busy="true">',
        '  <Skeleton' +
          (v.shape !== 'text' ? ' shape="' + String(v.shape) + '"' : '') +
          (v.shape === 'text' && v.lines !== '1' ? ' lines={' + String(v.lines) + '}' : '') +
          (str(v, 'width') ? ' width={' + JSON.stringify(dimension(str(v, 'width'))) + '}' : '') +
          (str(v, 'height')
            ? ' height={' + JSON.stringify(dimension(str(v, 'height'))) + '}'
            : '') +
          ' />',
        '  <span className="nui-visually-hidden">Carregando</span>',
        '</div>',
      ].join('\n'),
  },
  anatomy: [
    {
      label: 'Barra',
      description: 'Decorativa (aria-hidden), com pulso suave que desliga em reduced-motion.',
      selector: '.nui-skeleton',
    },
  ],
  dos: [
    { text: 'Imite o formato do conteúdo que vai chegar.' },
    { text: 'Anuncie o carregamento no contêiner com aria-busy.' },
  ],
  donts: [{ text: 'Não use skeleton para esperas longas: mostre progresso ou uma explicação.' }],
};
