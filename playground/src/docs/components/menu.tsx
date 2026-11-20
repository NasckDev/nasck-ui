import { Menu } from '../../../../src';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { bool, csv, quote, str } from '../shared';

const MENU_ITEMS = [
  { id: 'edit', label: 'Editar', icon: <Pencil size={16} /> },
  { id: 'copy', label: 'Duplicar', icon: <Copy size={16} /> },
  { id: 'export', label: 'Exportar CSV', icon: <Download size={16} /> },
  {
    id: 'del',
    label: 'Excluir',
    icon: <Trash2 size={16} />,
    tone: 'danger' as const,
    separatorBefore: true,
  },
];

const menuControls: Control[] = [
  { name: 'label', kind: 'text', default: 'Ações' },
  { name: 'items', kind: 'text', default: 'Editar, Duplicar, Arquivar, Excluir' },
  { name: 'dangerLast', kind: 'boolean', default: true },
  {
    name: 'variant',
    kind: 'select',
    options: ['primary', 'secondary', 'ghost', 'danger'],
    default: 'secondary',
  },
  { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
  { name: 'align', kind: 'select', options: ['start', 'end'], default: 'start' },
  { name: 'iconOnly', kind: 'boolean', default: false },
];

const menuItems = (v: ControlValues) => {
  const labels = csv(v, 'items');
  return labels.map((label, index) => ({
    id: 'item-' + String(index + 1),
    label,
    ...(bool(v, 'dangerLast') && index === labels.length - 1 && labels.length > 1
      ? { tone: 'danger' as const, separatorBefore: true }
      : {}),
  }));
};

export const doc: ComponentDoc = {
  slug: 'menu',
  name: 'Menu',
  group: 'Navegação e sobreposição',
  summary:
    'Menu suspenso de ações com ícones, itens desabilitados, separador e busca por digitação.',
  semantics:
    'Segue o padrão de botão de menu do guia de acessibilidade do W3C (WAI-ARIA APG): o botão abre uma lista de ações (role="menu") navegável por setas.',
  keyboard: [
    { keys: 'Enter / Espaço / ↓', action: 'Abre o menu e foca o primeiro item.' },
    { keys: '↑', action: 'Abre o menu e foca o último item.' },
    { keys: '↓ / ↑', action: 'Move entre itens, pulando desabilitados, com volta.' },
    { keys: 'Home / End', action: 'Primeiro / último item.' },
    { keys: 'Letras', action: 'Foca o item que começa com o texto digitado.' },
    { keys: 'Enter / Espaço', action: 'Ativa o item, fecha o menu e devolve o foco ao botão.' },
    { keys: 'Esc', action: 'Fecha e devolve o foco ao botão.' },
    { keys: 'Tab', action: 'Fecha o menu e segue a ordem normal da página a partir do botão.' },
  ],
  aria: [
    'O botão tem aria-haspopup="menu", aria-expanded e aria-controls enquanto aberto.',
    'Itens usam role="menuitem" com tabindex -1 e foco gerenciado por JavaScript.',
    'Itens desabilitados usam aria-disabled e não disparam onSelect.',
    'O menu fecha ao clicar fora, rolar a página ou redimensionar a janela.',
    'Com iconOnly, label vira o nome acessível do botão quadrado.',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Texto e nome acessível do botão (obrigatório).',
    },
    {
      name: 'items',
      type: 'MenuItem[]',
      description: 'id, label, icon, onSelect, disabled, tone e separatorBefore.',
    },
    { name: 'iconOnly / icon', type: 'boolean / ReactNode', description: 'Botão só com ícone.' },
    {
      name: 'variant / size / align',
      type: 'ButtonVariant / ButtonSize / start | end',
      description: 'Aparência e alinhamento do menu.',
    },
  ],
  demos: [
    {
      title: 'Menu de ações',
      preview: (
        <div className="pg-row">
          <Menu label="Ações" items={MENU_ITEMS} />
          <Menu
            label="Mais ações"
            iconOnly
            icon={<span aria-hidden="true">⋯</span>}
            variant="ghost"
            items={MENU_ITEMS}
            align="end"
          />
        </div>
      ),
      code: `<Menu label="Ações" items={[\n  { id: 'edit', label: 'Editar', icon: <Pencil size={16} /> },\n  { id: 'del', label: 'Excluir', tone: 'danger', separatorBefore: true },\n]} />`,
    },
  ],
  playground: {
    controls: menuControls,
    render: (v) => (
      <Menu
        label={str(v, 'label') || 'Ações'}
        items={menuItems(v)}
        variant={v.variant as 'primary'}
        size={v.size as 'sm' | 'md' | 'lg'}
        align={v.align as 'start' | 'end'}
        iconOnly={bool(v, 'iconOnly')}
        icon={bool(v, 'iconOnly') ? <span aria-hidden="true">⋯</span> : undefined}
      />
    ),
    setup: (v) =>
      'const items: MenuItem[] = [\n' +
      menuItems(v)
        .map(
          (item) =>
            '  { id: ' +
            quote(item.id) +
            ', label: ' +
            quote(item.label) +
            ('tone' in item ? ", tone: 'danger', separatorBefore: true" : '') +
            ' },',
        )
        .join('\n') +
      '\n];',
    code: (v) =>
      generateJsx('Menu', menuControls, v, {
        always: ['label'],
        skip: ['items', 'dangerLast'],
        fixed: ['items={items}'],
      }),
  },
  anatomy: [
    {
      label: 'Botão',
      description: 'Abre o menu; mostra uma seta quando tem texto.',
      selector: '.nui-menu__trigger',
    },
  ],
  dos: [
    {
      text: 'Rotule destrutivos com o que acontece e use tone="danger".',
      code: "{ label: 'Excluir fatura', tone: 'danger' }",
    },
    { text: 'Agrupe com separatorBefore.' },
  ],
  donts: [
    { text: 'Não use Menu para navegação do site: use links e nav.' },
    { text: 'Não ponha informação essencial só dentro do menu.' },
  ],
};
