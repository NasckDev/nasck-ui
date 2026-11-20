import { Accordion } from '../../../../src';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { bool, csv, quote } from '../shared';

const FAQ = [
  {
    id: 'a',
    title: 'Posso testar antes de assinar?',
    content: 'Sim. São 14 dias sem cartão e com todos os recursos liberados.',
  },
  {
    id: 'b',
    title: 'Como cancelo a assinatura?',
    content: 'Em Configurações, Cobrança. O acesso continua até o fim do ciclo pago.',
  },
  {
    id: 'c',
    title: 'Quem pode ver as faturas?',
    content: 'Apenas quem tem o papel Financeiro ou Administrador.',
  },
];

const accordionControls: Control[] = [
  {
    name: 'titles',
    kind: 'text',
    default:
      'Posso testar antes de assinar?, Como cancelo a assinatura?, Quem pode ver as faturas?',
  },
  { name: 'multiple', kind: 'boolean', default: false },
  { name: 'headingLevel', kind: 'select', options: ['2', '3', '4'], default: '3' },
];

const accordionItems = (v: ControlValues) =>
  csv(v, 'titles').map((title, index) => ({
    id: 'item-' + String(index + 1),
    title,
    content: FAQ[index]?.content ?? 'Resposta para: ' + title,
  }));

export const doc: ComponentDoc = {
  slug: 'accordion',
  name: 'Accordion',
  group: 'Navegação e sobreposição',
  summary: 'Seções recolhíveis com animação de altura. Um painel por vez ou vários.',
  semantics:
    'Segue o padrão de acordeão do guia de acessibilidade do W3C (WAI-ARIA APG): cada título é um botão dentro de um heading, que informa se está aberto (aria-expanded) e qual painel controla (aria-controls).',
  keyboard: [
    { keys: 'Enter / Espaço', action: 'Abre ou fecha o painel do cabeçalho em foco.' },
    { keys: '↓ / ↑', action: 'Move para o próximo / anterior cabeçalho (com volta ao início).' },
    { keys: 'Home / End', action: 'Primeiro / último cabeçalho.' },
    {
      keys: 'Tab',
      action: 'Segue para o próximo controle, inclusive dentro de painéis abertos.',
    },
  ],
  aria: [
    'Cada título é um <h3> (configurável em headingLevel) com um <button> dentro.',
    'aria-expanded indica o estado e aria-controls aponta para a região do painel.',
    'Painéis fechados saem da árvore de acessibilidade (visibility) e da ordem de tabulação.',
    'Itens desabilitados são pulados nas setas.',
  ],
  props: [
    {
      name: 'items',
      type: 'AccordionItem[]',
      description: 'id, title, content e disabled opcional.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Permite vários painéis abertos. Padrão: um por vez.',
    },
    {
      name: 'value / defaultValue / onValueChange',
      type: 'string[]',
      description: 'Ids abertos, controlado ou não.',
    },
    {
      name: 'headingLevel',
      type: '2 | 3 | 4 | 5 | 6',
      description: 'Nível do heading. Padrão: 3.',
    },
  ],
  demos: [
    {
      title: 'Perguntas frequentes',
      preview: <Accordion items={FAQ} defaultValue={['a']} />,
      code: `<Accordion defaultValue={['a']} items={items} />`,
      setup: `const items = [
  { id: 'a', title: 'Posso testar antes de assinar?', content: 'Sim. São 14 dias sem cartão e com todos os recursos liberados.' },
  { id: 'b', title: 'Como cancelo a assinatura?', content: 'Em Configurações, Cobrança. O acesso continua até o fim do ciclo pago.' },
];`,
    },
  ],
  playground: {
    controls: accordionControls,
    render: (v) => (
      <Accordion
        key={String(v.multiple) + csv(v, 'titles').join('|')}
        items={accordionItems(v)}
        multiple={bool(v, 'multiple')}
        headingLevel={Number(v.headingLevel) as 2 | 3 | 4}
        defaultValue={['item-1']}
      />
    ),
    setup: (v) =>
      'const items = [\n' +
      accordionItems(v)
        .map(
          (item) =>
            '  { id: ' +
            quote(item.id) +
            ', title: ' +
            quote(item.title) +
            ', content: ' +
            quote(item.content) +
            ' },',
        )
        .join('\n') +
      '\n];',
    code: (v) =>
      "<Accordion items={items} defaultValue={['item-1']}" +
      (bool(v, 'multiple') ? ' multiple' : '') +
      (v.headingLevel !== '3' ? ' headingLevel={' + String(v.headingLevel) + '}' : '') +
      ' />',
  },
  anatomy: [
    {
      label: 'Cabeçalho',
      description: 'Botão dentro de um heading, com aria-expanded.',
      selector: '.nui-accordion__trigger',
    },
    {
      label: 'Indicador',
      description: 'Seta que gira ao abrir.',
      selector: '.nui-accordion__chevron',
    },
    {
      label: 'Painel',
      description: 'Região rotulada pelo cabeçalho.',
      selector: '.nui-accordion__panel',
    },
  ],
  dos: [
    { text: 'Use títulos que resumem o conteúdo, como perguntas ou tópicos.' },
    {
      text: 'Escolha headingLevel conforme o contorno da página.',
      code: '<Accordion headingLevel={2} … />',
    },
  ],
  donts: [
    { text: 'Não esconda informação crítica (como erros) dentro de um painel fechado.' },
    { text: 'Não aninhe accordions: a navegação fica confusa.' },
  ],
};
