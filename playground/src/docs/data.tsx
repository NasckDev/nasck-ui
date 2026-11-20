import { useState } from 'react';
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  Combobox,
  Menu,
  Pagination,
  Table,
  type TableColumn,
} from '../../../src';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react';
import { generateJsx } from '../lib/codegen';
import type { Control, ComponentDoc } from './types';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: 'Pago' | 'Pendente' | 'Atrasado';
}

const INVOICES: Invoice[] = [
  { id: 'F-1042', client: 'Lumen Estúdio', amount: 4820.5, status: 'Pago' },
  { id: 'F-1043', client: 'Cooperativa Alvorada', amount: 12900, status: 'Pendente' },
  { id: 'F-1044', client: 'Mercado Beira-Rio', amount: 780.9, status: 'Atrasado' },
  { id: 'F-1045', client: 'Clínica Vértice', amount: 3150, status: 'Pago' },
  { id: 'F-1046', client: 'Oficina do Tato', amount: 1290.75, status: 'Pendente' },
];

const brl = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const STATUS_TONE = { Pago: 'success', Pendente: 'warning', Atrasado: 'danger' } as const;

const invoiceColumns: TableColumn<Invoice>[] = [
  {
    id: 'client',
    header: 'Cliente',
    cell: (row) => row.client,
    sortable: true,
    sortValue: (row) => row.client,
    isRowHeader: true,
  },
  {
    id: 'id',
    header: 'Fatura',
    cell: (row) => <code>{row.id}</code>,
    sortable: true,
    sortValue: (row) => row.id,
  },
  {
    id: 'amount',
    header: 'Valor',
    cell: (row) => brl(row.amount),
    sortable: true,
    sortValue: (row) => row.amount,
    align: 'end',
  },
  {
    id: 'status',
    header: 'Situação',
    cell: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
];

const PEOPLE = [
  'Marina Duarte',
  'Caio Fernandes',
  'Beatriz Nogueira',
  'Renan Albuquerque',
  'Sofia Tavares',
  'Otávio Lins',
].map((name) => ({ name }));

const CITIES = [
  { value: 'sp', label: 'São Paulo', description: 'SP' },
  { value: 'rj', label: 'Rio de Janeiro', description: 'RJ' },
  { value: 'bh', label: 'Belo Horizonte', description: 'MG' },
  { value: 'cwb', label: 'Curitiba', description: 'PR' },
  { value: 'poa', label: 'Porto Alegre', description: 'RS' },
  { value: 'ssa', label: 'Salvador', description: 'BA' },
  { value: 'rec', label: 'Recife', description: 'PE' },
  { value: 'for', label: 'Fortaleza', description: 'CE' },
];

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

function PaginationDemo({ total = 24 }: { total?: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="pg-stack">
      <Pagination page={page} pageCount={total} onPageChange={setPage} />
      <p className="pg-note">Página atual: {page}</p>
    </div>
  );
}

const avatarControls: Control[] = [
  { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
  { name: 'name', kind: 'text', default: 'Marina Duarte' },
];

const menuControls: Control[] = [
  {
    name: 'variant',
    kind: 'select',
    options: ['primary', 'secondary', 'ghost', 'danger'],
    default: 'secondary',
  },
  { name: 'align', kind: 'select', options: ['start', 'end'], default: 'start' },
  { name: 'iconOnly', kind: 'boolean', default: false },
];

const comboControls: Control[] = [
  { name: 'required', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
  { name: 'hasError', kind: 'boolean', default: false },
];

const accordionControls: Control[] = [{ name: 'multiple', kind: 'boolean', default: false }];

export const dataDocs: readonly ComponentDoc[] = [
  {
    slug: 'avatar',
    name: 'Avatar',
    group: 'Conteúdo e feedback',
    summary:
      'Foto ou iniciais coloridas de uma pessoa, com grupo sobreposto e contador. A cor é estável por nome.',
    semantics: 'Container com role="img" e aria-label com o nome; a imagem interna é decorativa.',
    keyboard: [{ keys: '—', action: 'Não interativo: não entra na ordem de tabulação.' }],
    aria: [
      'O nome da pessoa vira o rótulo do avatar; as iniciais são aria-hidden para não serem lidas duas vezes.',
      'Se a foto falhar ao carregar, as iniciais aparecem no lugar.',
      'AvatarGroup anuncia o conjunto como role="group" com um rótulo e o contador como "mais N".',
      'As cores usam pares do próprio tema com contraste AA; o nome é o sinal, não a cor.',
    ],
    props: [
      {
        name: 'name',
        type: 'string',
        description: 'Nome completo (obrigatório). Gera iniciais, cor e nome acessível.',
      },
      { name: 'src', type: 'string', description: 'URL da foto. Opcional.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Tamanho. Padrão: md.' },
      {
        name: 'AvatarGroup.max',
        type: 'number',
        description: 'Quantos avatares aparecem antes do "+N". Padrão: 4.',
      },
    ],
    demos: [
      {
        title: 'Tamanhos e cores',
        preview: (
          <div className="pg-row">
            {PEOPLE.map((person) => (
              <Avatar key={person.name} name={person.name} />
            ))}
            <Avatar name="Marina Duarte" size="sm" />
            <Avatar name="Marina Duarte" size="lg" />
          </div>
        ),
        code: `<Avatar name="Marina Duarte" />
<Avatar name="Caio Fernandes" size="sm" />
<Avatar name="Beatriz Nogueira" size="lg" />`,
      },
      {
        title: 'Grupo com contador',
        preview: <AvatarGroup label="Responsáveis pelo projeto" people={PEOPLE} max={4} />,
        code: `<AvatarGroup label="Responsáveis pelo projeto" people={people} max={4} />`,
      },
    ],
    playground: {
      controls: avatarControls,
      render: (v) => (
        <Avatar name={String(v.name) || 'Sem nome'} size={v.size as 'sm' | 'md' | 'lg'} />
      ),
      code: (v) =>
        generateJsx('Avatar', avatarControls, v, {
          fixed: [`name="${String(v.name)}"`],
          skip: ['name'],
        }),
    },
    anatomy: [
      {
        label: 'Container',
        description: 'Moldura com raio pequeno, borda de 1 px e role="img".',
        selector: '.nui-avatar',
      },
      {
        label: 'Iniciais',
        description: 'Primeira e última palavra do nome, em Space Grotesk.',
        selector: '.nui-avatar__initials',
      },
    ],
    dos: [
      {
        text: 'Passe o nome completo: ele gera o rótulo acessível e a cor.',
        code: '<Avatar name="Marina Duarte" />',
      },
      {
        text: 'Use AvatarGroup com um rótulo que diga quem são.',
        code: '<AvatarGroup label="Revisores" people={…} />',
      },
    ],
    donts: [
      {
        text: 'Não use o avatar como único jeito de identificar quem fez algo: escreva o nome ao lado.',
      },
      { text: 'Não passe só o primeiro nome quando houver homônimos na lista.' },
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    group: 'Dados',
    summary:
      'Tabela ordenável e responsiva: no celular cada linha vira um cartão com rótulo e valor.',
    semantics:
      '<table> real com <caption>, aria-sort e botão de ordenação em cada cabeçalho; papéis ARIA explícitos mantêm a semântica no layout de cartões.',
    keyboard: [
      { keys: 'Tab', action: 'Move entre os botões de ordenação e controles dentro das células.' },
      { keys: 'Enter / Espaço', action: 'Ordena pela coluna: crescente, decrescente, sem ordem.' },
    ],
    aria: [
      'caption dá o nome da tabela; use hideCaption para ocultá-lo só visualmente.',
      'aria-sort aparece apenas em colunas ordenáveis (none, ascending, descending).',
      'O estado de ordenação é anunciado dentro do botão ("ordem crescente").',
      'A coluna com isRowHeader vira <th scope="row">, o que ajuda a ler cada linha.',
      'Em telas estreitas (container query), os rótulos vêm de data-label e o thead fica oculto só visualmente.',
    ],
    props: [
      { name: 'caption', type: 'string', description: 'Nome da tabela (obrigatório).' },
      {
        name: 'columns',
        type: 'TableColumn<Row>[]',
        description: 'id, header, cell, sortable, sortValue, align e isRowHeader.',
      },
      {
        name: 'rows / getRowId',
        type: 'Row[] / (row) => string',
        description: 'Dados e chave estável de cada linha.',
      },
      {
        name: 'sort / defaultSort / onSortChange',
        type: 'SortState | null',
        description: 'Ordenação controlada ou não.',
      },
      { name: 'emptyMessage', type: 'ReactNode', description: 'Conteúdo quando não há linhas.' },
    ],
    demos: [
      {
        title: 'Ordenável',
        note: 'Clique no cabeçalho ou use Enter/Espaço. Reduza a janela para ver os cartões.',
        preview: (
          <Table
            caption="Faturas do mês"
            columns={invoiceColumns}
            rows={INVOICES}
            getRowId={(row) => row.id}
            defaultSort={{ columnId: 'amount', direction: 'descending' }}
          />
        ),
        code: `const columns: TableColumn<Invoice>[] = [
  { id: 'client', header: 'Cliente', cell: (r) => r.client,
    sortable: true, sortValue: (r) => r.client, isRowHeader: true },
  { id: 'amount', header: 'Valor', cell: (r) => brl(r.amount),
    sortable: true, sortValue: (r) => r.amount, align: 'end' },
];

<Table caption="Faturas do mês" columns={columns}
  rows={invoices} getRowId={(r) => r.id} />`,
      },
      {
        title: 'Vazia',
        preview: (
          <Table
            caption="Faturas"
            columns={invoiceColumns}
            rows={[]}
            getRowId={(row) => row.id}
            emptyMessage="Nenhuma fatura neste período."
          />
        ),
        code: `<Table caption="Faturas" columns={columns} rows={[]}
  getRowId={(r) => r.id} emptyMessage="Nenhuma fatura neste período." />`,
      },
    ],
    anatomy: [
      {
        label: 'Legenda',
        description: 'Nome da tabela, lido por leitores de tela.',
        selector: '.nui-table__caption',
      },
      {
        label: 'Cabeçalho',
        description: 'Células com aria-sort e botão de ordenação.',
        selector: '.nui-table__th',
      },
      { label: 'Linha', description: 'Vira cartão abaixo de 40rem.', selector: '.nui-table__row' },
      {
        label: 'Cabeçalho de linha',
        description: 'A coluna que nomeia a linha.',
        selector: '.nui-table__td--head',
      },
    ],
    dos: [
      {
        text: 'Dê uma legenda curta que diga o que a tabela mostra.',
        code: 'caption="Faturas do mês"',
      },
      {
        text: 'Marque a coluna que identifica a linha com isRowHeader.',
        code: 'isRowHeader: true',
      },
      { text: 'Alinhe números ao final e formate em pt-BR.', code: "align: 'end'" },
    ],
    donts: [
      { text: 'Não use Table para organizar layout de página.' },
      { text: 'Não deixe colunas ordenáveis sem sortValue: o botão não faria nada.' },
      { text: 'Não esconda informação essencial só em tooltips dentro das células.' },
    ],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    group: 'Dados',
    summary:
      'Navegação entre páginas com janela de vizinhas, reticências e botões anterior e próxima.',
    semantics: '<nav aria-label> com lista de botões; a página atual usa aria-current="page".',
    keyboard: [
      { keys: 'Tab / Shift+Tab', action: 'Percorre os botões de página.' },
      { keys: 'Enter / Espaço', action: 'Vai para a página.' },
    ],
    aria: [
      'O nav tem nome (padrão "Paginação"); troque com label quando houver mais de uma.',
      'Cada número tem aria-label "Página N"; a atual leva aria-current="page".',
      'Anterior e Próxima ficam desabilitados nas pontas.',
      'As reticências são decorativas (aria-hidden).',
    ],
    props: [
      {
        name: 'page / pageCount',
        type: 'number',
        description: 'Página atual (a partir de 1) e total.',
      },
      {
        name: 'onPageChange',
        type: '(page: number) => void',
        description: 'Chamado ao escolher outra página.',
      },
      {
        name: 'siblingCount',
        type: 'number',
        description: 'Vizinhas de cada lado da atual. Padrão: 1.',
      },
      { name: 'label', type: 'string', description: 'Nome do landmark. Padrão: "Paginação".' },
    ],
    demos: [
      {
        title: 'Com muitas páginas',
        preview: <PaginationDemo />,
        code: `const [page, setPage] = useState(1);\n\n<Pagination page={page} pageCount={24} onPageChange={setPage} />`,
      },
      {
        title: 'Poucas páginas',
        preview: <PaginationDemo total={5} />,
        code: `<Pagination page={page} pageCount={5} onPageChange={setPage} />`,
      },
    ],
    anatomy: [
      {
        label: 'Anterior / Próxima',
        description: 'Navegação sequencial, desabilitada nas pontas.',
        selector: '.nui-pagination__step',
      },
      {
        label: 'Página',
        description: 'Botão numerado; a atual é preenchida.',
        selector: '.nui-pagination__button:not(.nui-pagination__step)',
      },
      {
        label: 'Reticências',
        description: 'Indicam páginas omitidas.',
        selector: '.nui-pagination__ellipsis',
      },
    ],
    dos: [
      { text: 'Mantenha a página na URL para poder compartilhar e recarregar.' },
      { text: 'Mostre o total de itens perto da paginação.' },
    ],
    donts: [
      { text: 'Não use Pagination para listas curtas que cabem numa tela.' },
      { text: 'Não troque o conteúdo sem avisar quem usa leitor de tela: anuncie a mudança.' },
    ],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    group: 'Navegação e sobreposição',
    summary: 'Seções recolhíveis com animação de altura. Um painel por vez ou vários.',
    semantics:
      'Padrão APG Accordion: botão dentro de heading com aria-expanded e aria-controls, painel como region.',
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
        code: `<Accordion defaultValue={['a']} items={[\n  { id: 'a', title: 'Posso testar antes de assinar?', content: '…' },\n]} />`,
      },
    ],
    playground: {
      controls: accordionControls,
      render: (v) => (
        <Accordion
          key={String(v.multiple)}
          items={FAQ}
          multiple={Boolean(v.multiple)}
          defaultValue={['a']}
        />
      ),
      code: (v) => generateJsx('Accordion', accordionControls, v, { fixed: ['items={items}'] }),
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
  },
  {
    slug: 'menu',
    name: 'Menu',
    group: 'Navegação e sobreposição',
    summary:
      'Menu suspenso de ações com ícones, itens desabilitados, separador e busca por digitação.',
    semantics:
      'Padrão APG Menu Button: botão com aria-haspopup="menu" que abre um menu com itens menuitem.',
    keyboard: [
      { keys: 'Enter / Espaço / ↓', action: 'Abre o menu e foca o primeiro item.' },
      { keys: '↑', action: 'Abre o menu e foca o último item.' },
      { keys: '↓ / ↑', action: 'Move entre itens, pulando desabilitados, com volta.' },
      { keys: 'Home / End', action: 'Primeiro / último item.' },
      { keys: 'Letras', action: 'Foca o item que começa com o texto digitado.' },
      { keys: 'Enter / Espaço', action: 'Ativa o item, fecha o menu e devolve o foco ao botão.' },
      { keys: 'Esc', action: 'Fecha e devolve o foco ao botão.' },
      { keys: 'Tab', action: 'Fecha o menu e segue o fluxo normal.' },
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
          label="Ações"
          items={MENU_ITEMS}
          variant={v.variant as 'primary'}
          align={v.align as 'start' | 'end'}
          iconOnly={Boolean(v.iconOnly)}
          icon={<span aria-hidden="true">⋯</span>}
        />
      ),
      code: (v) =>
        generateJsx('Menu', menuControls, v, { fixed: ['label="Ações"', 'items={items}'] }),
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
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    group: 'Formulários',
    summary:
      'Campo com sugestões filtradas por digitação, sem acento e sem diferenciar maiúsculas.',
    semantics:
      'Padrão APG Combobox com autocomplete de lista: input role="combobox" com aria-activedescendant e listbox.',
    keyboard: [
      { keys: '↓', action: 'Abre a lista e move para a próxima opção.' },
      { keys: '↑', action: 'Abre na última opção ou move para a anterior.' },
      { keys: 'Enter', action: 'Seleciona a opção ativa.' },
      { keys: 'Esc', action: 'Fecha a lista e restaura o texto da seleção.' },
      { keys: 'Tab', action: 'Sai do campo e fecha a lista.' },
      { keys: 'Digitar', action: 'Filtra as opções.' },
    ],
    aria: [
      'O foco permanece no input; a opção ativa é apontada por aria-activedescendant.',
      'aria-expanded, aria-controls e aria-autocomplete="list" no input.',
      'Uma região viva anuncia "N resultados" ou "Nenhum resultado".',
      'Descrição e erro entram em aria-describedby, e o erro define aria-invalid.',
    ],
    props: [
      { name: 'label', type: 'ReactNode', description: 'Rótulo visível (obrigatório).' },
      {
        name: 'options',
        type: 'ComboboxOption[]',
        description: 'value, label, description e disabled.',
      },
      {
        name: 'value / defaultValue / onValueChange',
        type: 'string | null',
        description: 'Seleção controlada ou não.',
      },
      {
        name: 'description / error / required / disabled',
        type: 'ReactNode / boolean',
        description: 'Mesmo contrato dos outros campos.',
      },
      {
        name: 'emptyMessage',
        type: 'string',
        description: 'Texto sem resultados. Padrão: "Nenhum resultado".',
      },
    ],
    demos: [
      {
        title: 'Busca de cidade',
        note: 'Digite "sao" ou use as setas.',
        preview: (
          <Combobox
            label="Cidade"
            description="Digite para filtrar."
            options={CITIES}
            placeholder="Buscar cidade"
          />
        ),
        code: `<Combobox label="Cidade" description="Digite para filtrar."\n  options={cities} placeholder="Buscar cidade" />`,
      },
      {
        title: 'Com erro',
        preview: (
          <Combobox label="Cidade" options={CITIES} error="Escolha uma cidade da lista." required />
        ),
        code: `<Combobox label="Cidade" options={cities} required\n  error="Escolha uma cidade da lista." />`,
      },
    ],
    playground: {
      controls: comboControls,
      render: (v) => (
        <Combobox
          label="Cidade"
          options={CITIES}
          placeholder="Buscar cidade"
          required={Boolean(v.required)}
          disabled={Boolean(v.disabled)}
          error={v.hasError ? 'Escolha uma cidade da lista.' : undefined}
        />
      ),
      code: (v) => {
        const base = generateJsx('Combobox', comboControls, v, {
          fixed: ['label="Cidade"', 'options={cities}'],
          skip: ['hasError'],
        });
        return v.hasError
          ? base
              .replace(/\/>$/, '  error="Escolha uma cidade da lista."\n/>')
              .replace(/<Combobox /, '<Combobox\n  ')
          : base;
      },
    },
    anatomy: [
      {
        label: 'Rótulo',
        description: 'Sempre visível e ligado ao campo.',
        selector: '.nui-field__label',
      },
      {
        label: 'Campo',
        description: 'input com role="combobox".',
        selector: '.nui-combobox__input',
      },
      {
        label: 'Botão de lista',
        description: 'Mostra todas as opções; fora da ordem de tabulação.',
        selector: '.nui-combobox__toggle',
      },
    ],
    dos: [
      { text: 'Use para listas longas (mais de 7 itens) em que digitar é mais rápido.' },
      { text: 'Preencha description com o formato esperado.' },
    ],
    donts: [
      { text: 'Não use para listas curtas: um Select nativo é mais simples e robusto.' },
      { text: 'Não aceite texto livre sem validar contra as opções.' },
    ],
  },
];
