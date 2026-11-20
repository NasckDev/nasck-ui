import { Tabs } from '../../../../src';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { bool, csv, quote, str } from '../shared';

const tabItems = [
  { id: 'resumo', label: 'Resumo', content: 'Visão geral do projeto, com métricas da semana.' },
  { id: 'atividade', label: 'Atividade', content: 'Histórico de alterações recentes.' },
  { id: 'faturamento', label: 'Faturamento', content: 'Indisponível neste plano.', disabled: true },
  { id: 'ajustes', label: 'Ajustes', content: 'Preferências e integrações.' },
];

const tabsControls: Control[] = [
  { name: 'label', kind: 'text', default: 'Seções do projeto' },
  { name: 'tabs', kind: 'text', default: 'Resumo, Atividade, Ajustes' },
  { name: 'disableSecond', kind: 'boolean', default: false },
];

const playgroundTabs = (v: ControlValues) =>
  csv(v, 'tabs').map((label, index) => ({
    id: 'tab-' + String(index + 1),
    label,
    content: 'Conteúdo de ' + label + '.',
    disabled: index === 1 && bool(v, 'disableSecond'),
  }));

const tabsSource = (v: ControlValues): string =>
  'const items = [\n' +
  playgroundTabs(v)
    .map(
      (tab) =>
        '  { id: ' +
        quote(tab.id) +
        ', label: ' +
        quote(tab.label) +
        ', content: ' +
        quote(tab.content) +
        (tab.disabled ? ', disabled: true' : '') +
        ' },',
    )
    .join('\n') +
  '\n];';

export const doc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  group: 'Navegação e sobreposição',
  summary:
    'Abas com ativação automática, seguindo o padrão de abas do guia de acessibilidade do W3C (WAI-ARIA APG).',
  semantics:
    'role="tablist" > role="tab" + role="tabpanel"; só a aba ativa entra na ordem de tabulação, as outras se alcançam pelas setas.',
  keyboard: [
    {
      keys: '← / →',
      action: 'Move e ativa a aba anterior / seguinte, dando a volta nas pontas.',
    },
    { keys: 'Home / End', action: 'Vai para a primeira / última aba habilitada.' },
    { keys: 'Tab', action: 'Entra na lista (aba ativa) e depois no painel.' },
  ],
  aria: [
    'Cada aba tem aria-selected e aria-controls; cada painel tem aria-labelledby apontando para a aba.',
    'Roving tabindex: só a aba ativa está na ordem de tabulação.',
    'Abas desabilitadas são puladas na navegação por setas.',
    'label da lista vira aria-label do tablist.',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Nome acessível da lista de abas (obrigatório).',
    },
    { name: 'items', type: 'TabItem[]', description: '{ id, label, content, disabled? }.' },
    {
      name: 'value / defaultValue',
      type: 'string',
      description: 'Aba ativa controlada / inicial.',
    },
    {
      name: 'onValueChange',
      type: '(id: string) => void',
      description: 'Chamado ao trocar de aba.',
    },
  ],
  demos: [
    {
      title: 'Com aba desabilitada',
      note: 'Foque uma aba e use as setas: "Faturamento" é pulada.',
      preview: <Tabs label="Seções do projeto" items={tabItems} />,
      code: `<Tabs
  label="Seções do projeto"
  items={[
    { id: 'resumo', label: 'Resumo', content: '...' },
    { id: 'atividade', label: 'Atividade', content: '...' },
    { id: 'faturamento', label: 'Faturamento', content: '...', disabled: true },
    { id: 'ajustes', label: 'Ajustes', content: '...' },
  ]}
/>`,
    },
  ],
  playground: {
    controls: tabsControls,
    render: (v) => (
      <Tabs
        key={csv(v, 'tabs').join('|') + String(v.disableSecond)}
        label={str(v, 'label') || 'Seções'}
        items={playgroundTabs(v)}
      />
    ),
    setup: tabsSource,
    code: (v) => '<Tabs label=' + JSON.stringify(str(v, 'label') || 'Seções') + ' items={items} />',
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
};
