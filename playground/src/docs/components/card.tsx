import { Button, Card } from '../../../../src';
import { type ComponentDoc, type Control } from '../types';
import { attr, str } from '../shared';

const cardControls: Control[] = [
  { name: 'title', kind: 'text', default: 'Plano Equipe' },
  { name: 'description', kind: 'text', default: 'Cobrança mensal por pessoa.' },
  { name: 'body', kind: 'text', default: 'Até 20 pessoas e histórico de 90 dias.' },
  { name: 'footerLabel', kind: 'text', default: 'Assinar' },
  { name: 'headingLevel', kind: 'select', options: ['2', '3', '4'], default: '3' },
];

export const doc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  group: 'Conteúdo e feedback',
  summary: 'Contêiner de conteúdo. Com título, vira uma região rotulada pelo próprio heading.',
  semantics: '<section aria-labelledby> com heading configurável (h2 a h6).',
  keyboard: [
    { keys: '—', action: 'Não é interativo; os controles internos seguem a ordem do DOM.' },
  ],
  aria: [
    'headingLevel (padrão 3) ajusta o título à hierarquia da página, sem pular níveis.',
    'Sem title, não há região nem heading: é só um contêiner visual.',
  ],
  props: [
    { name: 'title', type: 'ReactNode', description: 'Título; rotula a seção.' },
    {
      name: 'headingLevel',
      type: '2 | 3 | 4 | 5 | 6',
      description: 'Nível do heading. Padrão: 3.',
    },
    { name: 'description / footer', type: 'ReactNode', description: 'Texto de apoio e rodapé.' },
  ],
  demos: [
    {
      title: 'Com descrição e ação',
      preview: (
        <Card
          title="Plano Pro"
          description="Para equipes que publicam toda semana."
          footer={<Button size="sm">Assinar</Button>}
        >
          Projetos ilimitados, histórico de 90 dias e suporte por e-mail.
        </Card>
      ),
      code: `<Card
  title="Plano Pro"
  description="Para equipes que publicam toda semana."
  footer={<Button size="sm">Assinar</Button>}
>
  Projetos ilimitados, histórico de 90 dias e suporte por e-mail.
</Card>`,
    },
  ],
  playground: {
    controls: cardControls,
    render: (v) => (
      <Card
        title={str(v, 'title') || undefined}
        headingLevel={Number(v.headingLevel) as 2 | 3 | 4}
        description={str(v, 'description') || undefined}
        footer={
          str(v, 'footerLabel') ? <Button size="sm">{str(v, 'footerLabel')}</Button> : undefined
        }
      >
        {str(v, 'body')}
      </Card>
    ),
    code: (v) =>
      [
        '<Card',
        str(v, 'title') ? '  ' + attr('title', str(v, 'title')) : '',
        v.headingLevel !== '3' ? '  headingLevel={' + String(v.headingLevel) + '}' : '',
        str(v, 'description') ? '  ' + attr('description', str(v, 'description')) : '',
        str(v, 'footerLabel')
          ? '  footer={<Button size="sm">' + str(v, 'footerLabel') + '</Button>}'
          : '',
        '>',
        '  ' + str(v, 'body'),
        '</Card>',
      ]
        .filter((line) => line !== '')
        .join('\n'),
  },
  anatomy: [
    {
      label: 'Título',
      description: 'Heading com nível configurável; nomeia a seção.',
      selector: '.nui-card__title',
    },
    {
      label: 'Descrição',
      description: 'Resumo em cor secundária.',
      selector: '.nui-card__description',
    },
    {
      label: 'Rodapé',
      description: 'Ações, separadas por um filete.',
      selector: '.nui-card__footer',
    },
  ],
  dos: [{ text: 'Ajuste headingLevel para respeitar a hierarquia da página.' }],
  donts: [{ text: 'Não aninhe cards dentro de cards.' }],
};
