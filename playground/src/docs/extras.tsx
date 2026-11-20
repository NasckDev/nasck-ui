import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  EmptyState,
  IconButton,
  Select,
  Skeleton,
  Switch,
  Tabs,
  TextField,
  Tooltip,
  useToast,
  type BadgeTone,
  type ButtonSize,
  type ButtonVariant,
  type ToastTone,
} from '../../../src';
import { Inbox, Plus } from 'lucide-react';
import { generateJsx } from '../lib/codegen';
import type { AnatomyPart, Control, ComponentDoc, ControlValues, Playground, Tip } from './types';

export interface DocExtras {
  playground?: Playground;
  anatomy?: readonly AnatomyPart[];
  anatomyStage?: ComponentDoc['anatomyStage'];
  dos: readonly Tip[];
  donts: readonly Tip[];
}

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const OPTIONS = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'bh', label: 'Belo Horizonte' },
];

const buttonControls: Control[] = [
  { name: 'children', kind: 'text', default: 'Salvar alterações' },
  { name: 'variant', kind: 'select', options: VARIANTS, default: 'primary' },
  { name: 'size', kind: 'select', options: SIZES, default: 'md' },
  { name: 'loading', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

const iconButtonControls: Control[] = [
  { name: 'variant', kind: 'select', options: VARIANTS, default: 'ghost' },
  { name: 'size', kind: 'select', options: SIZES, default: 'md' },
  { name: 'disabled', kind: 'boolean', default: false },
];

const fieldControls: Control[] = [
  { name: 'required', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
  { name: 'hasDescription', kind: 'boolean', default: true },
  { name: 'hasError', kind: 'boolean', default: false },
];

const checkboxControls: Control[] = [
  { name: 'indeterminate', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

const switchControls: Control[] = [{ name: 'disabled', kind: 'boolean', default: false }];

const tabsControls: Control[] = [{ name: 'disableMiddle', kind: 'boolean', default: true }];

const badgeControls: Control[] = [
  { name: 'children', kind: 'text', default: 'Em revisão' },
  {
    name: 'tone',
    kind: 'select',
    options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    default: 'neutral',
  },
];

const cardControls: Control[] = [
  { name: 'headingLevel', kind: 'select', options: ['2', '3', '4'], default: '3' },
  { name: 'hasDescription', kind: 'boolean', default: true },
  { name: 'hasFooter', kind: 'boolean', default: true },
];

const skeletonControls: Control[] = [
  { name: 'shape', kind: 'select', options: ['text', 'rect', 'circle'], default: 'text' },
  { name: 'lines', kind: 'select', options: ['1', '2', '3', '4'], default: '3' },
];

const emptyControls: Control[] = [{ name: 'hasAction', kind: 'boolean', default: true }];

const tooltipControls: Control[] = [
  { name: 'placement', kind: 'select', options: ['top', 'bottom'], default: 'top' },
];

const toastControls: Control[] = [
  {
    name: 'tone',
    kind: 'select',
    options: ['neutral', 'success', 'warning', 'danger'],
    default: 'success',
  },
  { name: 'hasDescription', kind: 'boolean', default: true },
];

const dialogControls: Control[] = [
  { name: 'role', kind: 'select', options: ['dialog', 'alertdialog'], default: 'dialog' },
  { name: 'hasDescription', kind: 'boolean', default: true },
];

const bool = (values: ControlValues, name: string): boolean => Boolean(values[name]);

function ToastPreview({ values }: { values: ControlValues }) {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: 'Alterações salvas',
          tone: values.tone as ToastTone,
          description: bool(values, 'hasDescription') ? 'Seu perfil foi atualizado.' : undefined,
        })
      }
    >
      Disparar toast
    </Button>
  );
}

function DialogPreview({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  const destructive = values.role === 'alertdialog';
  return (
    <>
      <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role={destructive ? 'alertdialog' : 'dialog'}
        title={destructive ? 'Excluir este projeto?' : 'Convidar pessoas'}
        description={
          bool(values, 'hasDescription') ? 'Descrição curta do que vai acontecer.' : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(false)}>
              Confirmar
            </Button>
          </>
        }
      />
    </>
  );
}

const withMessages = (values: ControlValues) => ({
  description: bool(values, 'hasDescription') ? 'Usamos só para avisos da conta.' : undefined,
  error: bool(values, 'hasError') ? 'Informe um e-mail válido.' : undefined,
});

const ERROR_PROP = '  error="Informe um e-mail válido."';

/** Inserts an extra prop line into generated JSX that already ends with `/>`. */
const appendProps = (code: string, lines: readonly string[]): string => {
  if (lines.length === 0) return code;
  const multi = code.startsWith('<') && code.includes('\n');
  const body = multi
    ? code.replace(/\n\/>$/, '')
    : code.replace(/ \/>$/, '').replace(/^<(\S+)/, '<$1\n ');
  return `${body}\n${lines.join('\n')}\n/>`;
};

const fieldCode = (tag: string, values: ControlValues, fixed: string[]): string => {
  const extra = [
    ...(bool(values, 'hasDescription') ? ['  description="Usamos só para avisos da conta."'] : []),
    ...(bool(values, 'hasError') ? [ERROR_PROP] : []),
  ];
  return appendProps(
    generateJsx(tag, fieldControls, values, { fixed, skip: ['hasDescription', 'hasError'] }),
    extra,
  );
};

const tabItems = (disableMiddle: boolean) => [
  { id: 'a', label: 'Resumo', content: 'Visão geral do projeto.' },
  { id: 'b', label: 'Atividade', content: 'Histórico recente.', disabled: disableMiddle },
  { id: 'c', label: 'Ajustes', content: 'Preferências e integrações.' },
];

export const extras: Record<string, DocExtras> = {
  button: {
    playground: {
      controls: buttonControls,
      render: (v) => (
        <Button
          variant={v.variant as ButtonVariant}
          size={v.size as ButtonSize}
          loading={bool(v, 'loading')}
          disabled={bool(v, 'disabled')}
        >
          {String(v.children)}
        </Button>
      ),
      code: (v) => generateJsx('Button', buttonControls, v, { childrenKey: 'children' }),
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
  },
  'icon-button': {
    playground: {
      controls: iconButtonControls,
      render: (v) => (
        <IconButton
          label="Adicionar item"
          icon={<Plus size={18} />}
          variant={v.variant as ButtonVariant}
          size={v.size as ButtonSize}
          disabled={bool(v, 'disabled')}
        />
      ),
      code: (v) =>
        generateJsx('IconButton', iconButtonControls, v, {
          fixed: ['label="Adicionar item"', 'icon={<Plus />}'],
        }),
    },
    anatomy: [
      {
        label: 'Contêiner',
        description: 'Botão quadrado, mínimo de 40 px (44 px no toque).',
        selector: '.nui-icon-button',
      },
      {
        label: 'Ícone',
        description: 'Decorativo (aria-hidden); o nome vem de label.',
        selector: '.nui-icon-button__icon',
      },
    ],
    dos: [
      { text: 'Sempre informe label com a ação.', code: '<IconButton label="Excluir" … />' },
      { text: 'Combine com Tooltip para mostrar o nome.' },
    ],
    donts: [
      { text: 'Não use ícones ambíguos sem tooltip ou texto.' },
      { text: 'Não deixe label vazio: a API exige nome acessível.' },
    ],
  },
  'text-field': {
    playground: {
      controls: fieldControls,
      render: (v) => (
        <TextField
          label="E-mail"
          type="email"
          required={bool(v, 'required')}
          disabled={bool(v, 'disabled')}
          {...withMessages(v)}
        />
      ),
      code: (v) => fieldCode('TextField', v, ['label="E-mail"', 'type="email"']),
    },
    anatomy: [
      {
        label: 'Rótulo',
        description: 'Sempre visível: placeholder não é rótulo.',
        selector: '.nui-field__label',
      },
      {
        label: 'Campo',
        description: 'input nativo com borda de 1 px e foco duplo.',
        selector: '.nui-control',
      },
      {
        label: 'Descrição',
        description: 'Ajuda ligada por aria-describedby.',
        selector: '.nui-field__description',
      },
    ],
    dos: [
      { text: 'Diga o formato esperado em description.' },
      { text: 'Escreva o erro dizendo como corrigir.', code: 'error="Informe um e-mail válido."' },
    ],
    donts: [
      { text: 'Não use placeholder no lugar do rótulo.' },
      { text: 'Não mostre só "Inválido": diga o que fazer.' },
    ],
  },
  checkbox: {
    playground: {
      controls: checkboxControls,
      render: (v) => (
        <Checkbox
          label="Receber resumo semanal"
          description="Enviado às segundas."
          indeterminate={bool(v, 'indeterminate')}
          disabled={bool(v, 'disabled')}
        />
      ),
      code: (v) =>
        generateJsx('Checkbox', checkboxControls, v, {
          fixed: ['label="Receber resumo semanal"', 'description="Enviado às segundas."'],
        }),
    },
    anatomy: [
      {
        label: 'Caixa',
        description: 'input[type=checkbox] nativo de 20 px.',
        selector: '.nui-checkbox__input',
      },
      {
        label: 'Rótulo',
        description: 'Clicável e ligado ao campo.',
        selector: '.nui-checkbox__label',
      },
    ],
    dos: [
      { text: 'Use para escolhas independentes e listas de seleção.' },
      { text: 'Use indeterminate no "selecionar tudo" parcial.' },
    ],
    donts: [
      { text: 'Não use para ações imediatas: use Switch.' },
      { text: 'Não escreva o rótulo como negação ("Não receber").' },
    ],
  },
  switch: {
    playground: {
      controls: switchControls,
      render: (v) => (
        <Switch label="Notificações por e-mail" disabled={bool(v, 'disabled')} defaultChecked />
      ),
      code: (v) =>
        generateJsx('Switch', switchControls, v, {
          fixed: ['label="Notificações por e-mail"', 'defaultChecked'],
        }),
    },
    anatomy: [
      {
        label: 'Trilho',
        description: 'button com role="switch" e aria-checked.',
        selector: '.nui-switch__track',
      },
      {
        label: 'Botão deslizante',
        description: 'Anima com translate; sem animação em reduced-motion.',
        selector: '.nui-switch__thumb',
      },
      {
        label: 'Rótulo',
        description: 'Descreve o que liga, no estado ligado.',
        selector: '.nui-switch__label',
      },
    ],
    dos: [{ text: 'Use para opções que valem na hora, sem botão de salvar.' }],
    donts: [
      { text: 'Não use em formulários com envio: prefira Checkbox.' },
      { text: 'Não mude o rótulo conforme o estado.' },
    ],
  },
  select: {
    playground: {
      controls: fieldControls,
      render: (v) => (
        <Select
          label="Cidade"
          options={OPTIONS}
          placeholder="Escolha"
          required={bool(v, 'required')}
          disabled={bool(v, 'disabled')}
          {...withMessages(v)}
        />
      ),
      code: (v) =>
        fieldCode('Select', v, ['label="Cidade"', 'options={options}', 'placeholder="Escolha"']),
    },
    anatomy: [
      {
        label: 'Rótulo',
        description: 'Visível e associado ao select.',
        selector: '.nui-field__label',
      },
      {
        label: 'Seletor',
        description: 'select nativo: teclado, leitor de tela e seletor do celular de graça.',
        selector: '.nui-select',
      },
    ],
    dos: [
      { text: 'Use para 3 a 7 opções excludentes.' },
      { text: 'Para listas longas, prefira o Combobox.' },
    ],
    donts: [{ text: 'Não use para duas opções: um Switch ou rádios servem melhor.' }],
  },
  tabs: {
    playground: {
      controls: tabsControls,
      render: (v) => (
        <Tabs
          key={String(v.disableMiddle)}
          label="Seções"
          items={tabItems(bool(v, 'disableMiddle'))}
        />
      ),
      code: (v) =>
        `<Tabs label="Seções" items={[\n  { id: 'a', label: 'Resumo', content: '…' },\n  { id: 'b', label: 'Atividade', content: '…'${bool(v, 'disableMiddle') ? ', disabled: true' : ''} },\n  { id: 'c', label: 'Ajustes', content: '…' },\n]} />`,
    },
    anatomy: [
      {
        label: 'Lista',
        description: 'role="tablist" com nome acessível.',
        selector: '.nui-tabs__list',
      },
      {
        label: 'Aba',
        description: 'Roving tabindex; a selecionada tem filete laranja.',
        selector: '.nui-tabs__tab',
      },
      {
        label: 'Painel',
        description: 'role="tabpanel" ligado à aba por aria-labelledby.',
        selector: '.nui-tabs__panel:not([hidden])',
      },
    ],
    dos: [{ text: 'Use para vistas do mesmo conteúdo, com rótulos curtos.' }],
    donts: [
      { text: 'Não use abas para etapas sequenciais: use um passo a passo.' },
      { text: 'Não esconda ações importantes só dentro de abas.' },
    ],
  },
  dialog: {
    playground: {
      controls: dialogControls,
      render: (v) => <DialogPreview values={v} />,
      code: (v) =>
        `<Dialog\n  open={open}\n  onOpenChange={setOpen}${v.role === 'alertdialog' ? '\n  role="alertdialog"' : ''}\n  title="${v.role === 'alertdialog' ? 'Excluir este projeto?' : 'Convidar pessoas'}"${bool(v, 'hasDescription') ? '\n  description="Descrição curta do que vai acontecer."' : ''}\n  footer={…}\n/>`,
    },
    anatomyStage: (
      <div className="nui-dialog" style={{ animation: 'none', maxWidth: '24rem' }}>
        <header className="nui-dialog__header">
          <h3 className="nui-dialog__title">Excluir projeto?</h3>
        </header>
        <p className="nui-dialog__description">Isso apaga os arquivos e não dá para desfazer.</p>
        <div className="nui-dialog__body">Conteúdo opcional.</div>
        <footer className="nui-dialog__footer">
          <Button variant="secondary" size="sm" tabIndex={-1}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" tabIndex={-1}>
            Excluir
          </Button>
        </footer>
      </div>
    ),
    anatomy: [
      {
        label: 'Título',
        description: 'Nomeia o diálogo (aria-labelledby).',
        selector: '.nui-dialog__title',
      },
      {
        label: 'Descrição',
        description: 'Contexto lido ao abrir (aria-describedby).',
        selector: '.nui-dialog__description',
      },
      {
        label: 'Rodapé',
        description: 'Ações; a destrutiva nunca recebe o foco inicial.',
        selector: '.nui-dialog__footer',
      },
    ],
    dos: [
      { text: 'Use alertdialog para confirmações destrutivas e foque Cancelar.' },
      { text: 'Devolva o foco a quem abriu ao fechar (já é automático).' },
    ],
    donts: [
      { text: 'Não abra diálogos sem ação do usuário.' },
      { text: 'Não empilhe um diálogo dentro de outro.' },
    ],
  },
  toast: {
    playground: {
      controls: toastControls,
      render: (v) => <ToastPreview values={v} />,
      code: (v) =>
        `const { toast } = useToast();\n\ntoast({\n  title: 'Alterações salvas',\n  tone: '${String(v.tone)}',${bool(v, 'hasDescription') ? "\n  description: 'Seu perfil foi atualizado.'," : ''}\n});`,
    },
    anatomyStage: (
      <ol className="nui-toast-list" style={{ maxWidth: '24rem' }}>
        <li className="nui-toast" data-tone="success" style={{ animation: 'none' }}>
          <div className="nui-toast__content">
            <p className="nui-toast__title">Alterações salvas</p>
            <p className="nui-toast__description">Seu perfil foi atualizado.</p>
          </div>
        </li>
      </ol>
    ),
    anatomy: [
      {
        label: 'Título',
        description: 'A frase anunciada pela região viva.',
        selector: '.nui-toast__title',
      },
      { label: 'Descrição', description: 'Detalhe opcional.', selector: '.nui-toast__description' },
      {
        label: 'Faixa de tom',
        description: 'A cor é reforçada pelo texto, nunca sozinha.',
        selector: '.nui-toast',
      },
    ],
    dos: [{ text: 'Use para confirmar ações que o usuário acabou de fazer.' }],
    donts: [
      { text: 'Não use toast para erros que exigem ação: mostre junto ao campo.' },
      { text: 'Não coloque botões essenciais dentro do toast.' },
    ],
  },
  tooltip: {
    playground: {
      controls: tooltipControls,
      render: (v) => (
        <Tooltip content="Cria um novo item" placement={v.placement as 'top' | 'bottom'}>
          <Button variant="secondary">Passe o mouse ou foque</Button>
        </Tooltip>
      ),
      code: (v) =>
        `<Tooltip content="Cria um novo item"${v.placement === 'bottom' ? ' placement="bottom"' : ''}>\n  <Button variant="secondary">…</Button>\n</Tooltip>`,
    },
    anatomyStage: (
      <div style={{ paddingTop: '2.5rem' }}>
        <span className="nui-tooltip">
          <Button variant="secondary" tabIndex={-1}>
            Gatilho
          </Button>
          <span className="nui-tooltip__bubble" role="presentation" style={{ animation: 'none' }}>
            Texto de apoio
          </span>
        </span>
      </div>
    ),
    anatomy: [
      {
        label: 'Gatilho',
        description: 'Elemento focável; recebe aria-describedby.',
        selector: '.nui-button',
      },
      {
        label: 'Balão',
        description: 'role="tooltip": aparece no hover e no foco, Esc fecha.',
        selector: '.nui-tooltip__bubble',
      },
    ],
    dos: [{ text: 'Use para complementar, como o nome de um ícone.' }],
    donts: [
      { text: 'Não coloque informação essencial ou links no tooltip.' },
      { text: 'Não use em itens desabilitados que ninguém consegue focar.' },
    ],
  },
  badge: {
    playground: {
      controls: badgeControls,
      render: (v) => <Badge tone={v.tone as BadgeTone}>{String(v.children)}</Badge>,
      code: (v) => generateJsx('Badge', badgeControls, v, { childrenKey: 'children' }),
    },
    anatomy: [
      {
        label: 'Etiqueta',
        description: 'Texto em Space Mono; o significado está no texto, não na cor.',
        selector: '.nui-badge',
      },
    ],
    dos: [
      { text: 'Use palavras curtas e específicas.', code: '<Badge tone="success">Pago</Badge>' },
    ],
    donts: [
      { text: 'Não dependa só da cor para comunicar o estado.' },
      { text: 'Não use Badge como botão.' },
    ],
  },
  card: {
    playground: {
      controls: cardControls,
      render: (v) => (
        <Card
          title="Plano Equipe"
          headingLevel={Number(v.headingLevel) as 2 | 3 | 4}
          description={bool(v, 'hasDescription') ? 'Cobrança mensal por pessoa.' : undefined}
          footer={bool(v, 'hasFooter') ? <Button size="sm">Assinar</Button> : undefined}
        >
          Até 20 pessoas, histórico de 90 dias.
        </Card>
      ),
      code: (v) =>
        `<Card\n  title="Plano Equipe"${v.headingLevel !== '3' ? `\n  headingLevel={${String(v.headingLevel)}}` : ''}${bool(v, 'hasDescription') ? '\n  description="Cobrança mensal por pessoa."' : ''}${bool(v, 'hasFooter') ? '\n  footer={<Button size="sm">Assinar</Button>}' : ''}\n>\n  Até 20 pessoas, histórico de 90 dias.\n</Card>`,
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
  },
  skeleton: {
    playground: {
      controls: skeletonControls,
      render: (v) => (
        <div aria-busy="true" style={{ width: '16rem' }}>
          <Skeleton shape={v.shape as 'text'} lines={Number(v.lines)} />
          <span className="nui-visually-hidden">Carregando</span>
        </div>
      ),
      code: (v) =>
        `<div aria-busy="true">\n  <Skeleton${v.shape !== 'text' ? ` shape="${String(v.shape)}"` : ''}${v.shape === 'text' && v.lines !== '1' ? ` lines={${String(v.lines)}}` : ''} />\n  <span className="nui-visually-hidden">Carregando</span>\n</div>`,
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
  },
  'empty-state': {
    playground: {
      controls: emptyControls,
      render: (v) => (
        <EmptyState
          icon={<Inbox size={32} />}
          title="Nenhuma fatura ainda"
          description="Quando você emitir a primeira, ela aparece aqui."
          action={bool(v, 'hasAction') ? <Button>Emitir fatura</Button> : undefined}
        />
      ),
      code: (v) =>
        `<EmptyState\n  title="Nenhuma fatura ainda"\n  description="Quando você emitir a primeira, ela aparece aqui."${bool(v, 'hasAction') ? '\n  action={<Button>Emitir fatura</Button>}' : ''}\n/>`,
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
  },
};
