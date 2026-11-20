import { Button, type ButtonSize, type ButtonVariant } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { Plus } from 'lucide-react';
import { bool, str } from '../shared';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const buttonControls: Control[] = [
  { name: 'children', kind: 'text', default: 'Salvar alterações' },
  { name: 'variant', kind: 'select', options: VARIANTS, default: 'primary' },
  { name: 'size', kind: 'select', options: SIZES, default: 'md' },
  { name: 'startIcon', kind: 'boolean', default: false },
  { name: 'loading', kind: 'boolean', default: false },
  { name: 'loadingLabel', kind: 'text', default: '' },
  { name: 'disabled', kind: 'boolean', default: false },
];

export const doc: ComponentDoc = {
  slug: 'button',
  name: 'Button',
  group: 'Ações',
  summary:
    'Dispara uma ação. Quatro variantes, três tamanhos e estado de carregamento que mantém o foco no botão.',
  semantics: '<button type="button"> nativo, com aria-busy e aria-disabled durante o carregamento.',
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
          <Button size="md" startIcon={<Plus size={16} />}>
            Novo item
          </Button>
          <Button size="lg">Grande</Button>
        </div>
      ),
      code: `<Button size="sm">Pequeno</Button>
<Button size="md" startIcon={<Plus size={16} />}>Novo item</Button>
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
  playground: {
    controls: buttonControls,
    render: (v) => (
      <Button
        variant={v.variant as ButtonVariant}
        size={v.size as ButtonSize}
        loading={bool(v, 'loading')}
        loadingLabel={str(v, 'loadingLabel') || undefined}
        disabled={bool(v, 'disabled')}
        startIcon={bool(v, 'startIcon') ? <Plus size={16} aria-hidden="true" /> : undefined}
      >
        {str(v, 'children')}
      </Button>
    ),
    code: (v) =>
      generateJsx('Button', buttonControls, v, {
        childrenKey: 'children',
        skip: ['startIcon'],
        fixed: bool(v, 'startIcon') ? ['startIcon={<Plus size={16} />}'] : [],
      }),
  },
  anatomy: [
    {
      label: 'Contêiner',
      description: 'button nativo com foco de anel duplo e raio de 4 px.',
      selector: '.nui-button',
    },
    {
      label: 'Rótulo',
      description: 'Texto em Space Grotesk que diz o que acontece.',
      selector: '.nui-button__label',
    },
  ],
  dos: [
    {
      text: 'Use verbo + objeto: o rótulo diz o que acontece.',
      code: '<Button>Salvar alterações</Button>',
    },
    { text: 'Use uma ação primária por tela e secundárias para o resto.' },
    {
      text: 'Use loading para ações assíncronas: o foco permanece no botão.',
      code: '<Button loading>Enviando</Button>',
    },
  ],
  donts: [
    { text: 'Evite rótulos vagos como "Clique aqui" ou "OK".' },
    { text: 'Não use danger para ações reversíveis: reserve para exclusões.' },
    { text: 'Não use Button para navegar: links (<a>) são mais adequados.' },
  ],
};
