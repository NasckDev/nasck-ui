import { Button, IconButton } from '../../../src';
import type { ComponentDoc } from './types';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3v10M3 8h10" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path
      d="M3 4.5h10M6.5 4.5V3h3v1.5M5 4.5l.5 8h5l.5-8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const actionDocs: readonly ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'Ações',
    summary:
      'Dispara uma ação. Quatro variantes, três tamanhos e estado de carregamento que mantém o foco no botão.',
    semantics:
      '<button type="button"> nativo, com aria-busy e aria-disabled durante o carregamento.',
    keyboard: [
      { keys: 'Enter', action: 'Ativa o botão.' },
      { keys: 'Espaço', action: 'Ativa o botão.' },
      { keys: 'Tab / Shift+Tab', action: 'Move o foco para o próximo / anterior controle.' },
    ],
    aria: [
      'No carregamento, aria-busy="true" e aria-disabled="true"; o botão continua focável e ignora cliques.',
      'O texto "Carregando" é anunciado por um span visualmente oculto (customizável em loadingLabel).',
      'type="button" por padrão, para não enviar formulários sem querer.',
      'Foco visível com anel duplo, que funciona em fundo claro e escuro e em forced-colors.',
    ],
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'danger'",
        description: 'Ênfase visual. Padrão: primary.',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Tamanho. Padrão: md.' },
      {
        name: 'loading',
        type: 'boolean',
        description: 'Mostra spinner, define aria-busy e ignora cliques.',
      },
      {
        name: 'loadingLabel',
        type: 'string',
        description: 'Texto anunciado no carregamento. Padrão: "Carregando".',
      },
      {
        name: 'startIcon / endIcon',
        type: 'ReactNode',
        description: 'Ícones decorativos antes / depois do rótulo.',
      },
    ],
    demos: [
      {
        title: 'Variantes',
        note: 'Hover escurece o fundo; foco mostra o anel duplo (use Tab para ver).',
        preview: (
          <div className="pg-row">
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Perigo</Button>
          </div>
        ),
        code: `<Button>Primário</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="danger">Perigo</Button>`,
      },
      {
        title: 'Tamanhos e ícones',
        preview: (
          <div className="pg-row">
            <Button size="sm">Pequeno</Button>
            <Button size="md" startIcon={<PlusIcon />}>
              Novo item
            </Button>
            <Button size="lg">Grande</Button>
          </div>
        ),
        code: `<Button size="sm">Pequeno</Button>
<Button size="md" startIcon={<PlusIcon />}>Novo item</Button>
<Button size="lg">Grande</Button>`,
      },
      {
        title: 'Desabilitado',
        note: 'Atributo disabled nativo: sai da ordem de tabulação.',
        preview: (
          <div className="pg-row">
            <Button disabled>Primário</Button>
            <Button variant="secondary" disabled>
              Secundário
            </Button>
            <Button variant="danger" disabled>
              Perigo
            </Button>
          </div>
        ),
        code: `<Button disabled>Primário</Button>`,
      },
      {
        title: 'Carregando',
        note: 'Continua focável (aria-busy) e ignora cliques, sem perder o foco.',
        preview: (
          <div className="pg-row">
            <Button loading>Enviando</Button>
            <Button variant="secondary" loading loadingLabel="Salvando alterações">
              Salvar
            </Button>
          </div>
        ),
        code: `<Button loading>Enviando</Button>
<Button variant="secondary" loading loadingLabel="Salvando alterações">Salvar</Button>`,
      },
    ],
  },
  {
    slug: 'icon-button',
    name: 'IconButton',
    group: 'Ações',
    summary: 'Botão só com ícone. O nome acessível é obrigatório pela API (prop label).',
    semantics: '<button> com aria-label vindo de label; o ícone é aria-hidden.',
    keyboard: [
      { keys: 'Enter / Espaço', action: 'Ativa o botão.' },
      { keys: 'Tab', action: 'Move o foco.' },
    ],
    aria: [
      'label é obrigatório e vira aria-label: controle sem texto visível precisa de nome.',
      'O ícone é decorativo (aria-hidden) e herda a cor do texto.',
      'Combine com Tooltip para mostrar o nome a quem usa mouse ou teclado.',
    ],
    props: [
      { name: 'label', type: 'string', description: 'Nome acessível (obrigatório).' },
      { name: 'icon', type: 'ReactNode', description: 'Ícone exibido.' },
      {
        name: 'variant / size',
        type: 'ButtonVariant / ButtonSize',
        description: 'Mesmas opções do Button. Padrão: ghost, md.',
      },
    ],
    demos: [
      {
        title: 'Variantes',
        preview: (
          <div className="pg-row">
            <IconButton label="Adicionar" icon={<PlusIcon />} />
            <IconButton label="Adicionar" icon={<PlusIcon />} variant="primary" />
            <IconButton label="Adicionar" icon={<PlusIcon />} variant="secondary" />
            <IconButton label="Excluir" icon={<TrashIcon />} variant="danger" />
            <IconButton label="Excluir" icon={<TrashIcon />} disabled />
          </div>
        ),
        code: `<IconButton label="Adicionar" icon={<PlusIcon />} />
<IconButton label="Adicionar" icon={<PlusIcon />} variant="primary" />
<IconButton label="Excluir" icon={<TrashIcon />} variant="danger" />
<IconButton label="Excluir" icon={<TrashIcon />} disabled />`,
      },
      {
        title: 'Tamanhos',
        preview: (
          <div className="pg-row">
            <IconButton label="Adicionar" icon={<PlusIcon />} size="sm" variant="secondary" />
            <IconButton label="Adicionar" icon={<PlusIcon />} size="md" variant="secondary" />
            <IconButton label="Adicionar" icon={<PlusIcon />} size="lg" variant="secondary" />
          </div>
        ),
        code: `<IconButton label="Adicionar" icon={<PlusIcon />} size="lg" variant="secondary" />`,
      },
    ],
  },
];
