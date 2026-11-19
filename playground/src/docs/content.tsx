import { Badge, Button, Card, EmptyState, Skeleton } from '../../../src';
import type { ComponentDoc } from './types';

const InboxIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <path d="M3 13l3-8h12l3 8v6H3z" strokeLinejoin="round" />
    <path d="M3 13h5l1 3h6l1-3h5" strokeLinejoin="round" />
  </svg>
);

export const contentDocs: readonly ComponentDoc[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
            icon={<InboxIcon />}
            headingLevel={3}
            title="Nenhum projeto ainda"
            description="Crie o primeiro para começar a acompanhar o andamento."
            action={<Button>Criar projeto</Button>}
          />
        ),
        code: `<EmptyState
  icon={<InboxIcon />}
  title="Nenhum projeto ainda"
  description="Crie o primeiro para começar a acompanhar o andamento."
  action={<Button>Criar projeto</Button>}
/>`,
      },
    ],
  },
];
