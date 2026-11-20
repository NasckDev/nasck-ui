import { Button, EmptyState } from '../../../../src';
import { type ComponentDoc, type Control } from '../types';
import { Inbox } from 'lucide-react';
import { attr, str } from '../shared';

const emptyControls: Control[] = [
  { name: 'title', kind: 'text', default: 'Nenhuma fatura ainda' },
  {
    name: 'description',
    kind: 'text',
    default: 'Quando você emitir a primeira, ela aparece aqui.',
  },
  { name: 'actionLabel', kind: 'text', default: 'Emitir fatura' },
  { name: 'headingLevel', kind: 'select', options: ['2', '3', '4'], default: '2' },
];

export const doc: ComponentDoc = {
  slug: 'empty-state',
  name: 'EmptyState',
  group: 'Conteúdo e feedback',
  summary: 'Explica por que não há conteúdo e qual é o próximo passo.',
  semantics: 'Heading + descrição + ação; ícone decorativo (aria-hidden).',
  keyboard: [{ keys: 'Tab', action: 'Alcança a ação, se houver.' }],
  aria: [
    'headingLevel (2 a 4, padrão 2) encaixa o título na hierarquia da página.',
    'O ícone é decorativo; a mensagem deve fazer sentido sem ele.',
    'Sempre ofereça um próximo passo (action) quando existir um.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Título (obrigatório).' },
    {
      name: 'description / icon / action',
      type: 'ReactNode',
      description: 'Apoio, ilustração e próximo passo.',
    },
    { name: 'headingLevel', type: '2 | 3 | 4', description: 'Nível do heading. Padrão: 2.' },
  ],
  demos: [
    {
      title: 'Lista vazia',
      preview: (
        <EmptyState
          icon={<Inbox size={32} />}
          headingLevel={3}
          title="Nenhum projeto ainda"
          description="Crie o primeiro para começar a acompanhar o andamento."
          action={<Button>Criar projeto</Button>}
        />
      ),
      code: `<EmptyState
  icon={<Inbox size={32} />}
  title="Nenhum projeto ainda"
  description="Crie o primeiro para começar a acompanhar o andamento."
  action={<Button>Criar projeto</Button>}
/>`,
    },
  ],
  playground: {
    controls: emptyControls,
    render: (v) => (
      <EmptyState
        icon={<Inbox size={32} />}
        title={str(v, 'title') || 'Vazio'}
        description={str(v, 'description') || undefined}
        headingLevel={Number(v.headingLevel) as 2 | 3 | 4}
        action={str(v, 'actionLabel') ? <Button>{str(v, 'actionLabel')}</Button> : undefined}
      />
    ),
    code: (v) =>
      [
        '<EmptyState',
        '  icon={<Inbox size={32} />}',
        '  ' + attr('title', str(v, 'title')),
        str(v, 'description') ? '  ' + attr('description', str(v, 'description')) : '',
        v.headingLevel !== '2' ? '  headingLevel={' + String(v.headingLevel) + '}' : '',
        str(v, 'actionLabel') ? '  action={<Button>' + str(v, 'actionLabel') + '</Button>}' : '',
        '/>',
      ]
        .filter((line) => line !== '')
        .join('\n'),
  },
  anatomy: [
    {
      label: 'Ícone',
      description: 'Ilustração decorativa (aria-hidden).',
      selector: '.nui-empty-state__icon',
    },
    {
      label: 'Título',
      description: 'Heading que diz o que está vazio.',
      selector: '.nui-empty-state__title',
    },
    { label: 'Ação', description: 'O próximo passo.', selector: '.nui-empty-state__action' },
  ],
  dos: [{ text: 'Explique por que está vazio e ofereça o próximo passo.' }],
  donts: [{ text: 'Não deixe só "Nenhum resultado" sem saída.' }],
};
