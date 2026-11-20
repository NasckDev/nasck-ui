import { useState } from 'react';
import { Pagination } from '../../../../src';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { attr, str } from '../shared';

function PaginationDemo({ total = 24 }: { total?: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="pg-stack">
      <Pagination page={page} pageCount={total} onPageChange={setPage} />
      <p className="pg-note">Página atual: {page}</p>
    </div>
  );
}

const paginationControls: Control[] = [
  { name: 'pageCount', kind: 'select', options: ['5', '12', '24', '100'], default: '24' },
  { name: 'siblingCount', kind: 'select', options: ['1', '2'], default: '1' },
  { name: 'label', kind: 'text', default: 'Paginação' },
];

function PaginationPreview({ values }: { values: ControlValues }) {
  const [page, setPage] = useState(1);
  const count = Number(values.pageCount);
  return (
    <div className="pg-stack">
      <Pagination
        page={Math.min(page, count)}
        pageCount={count}
        siblingCount={Number(values.siblingCount)}
        label={str(values, 'label') || undefined}
        onPageChange={setPage}
      />
      <p className="pg-note">Página atual: {Math.min(page, count)}</p>
    </div>
  );
}

export const doc: ComponentDoc = {
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
      code: `const [page, setPage] = useState(1);

<Pagination page={page} pageCount={5} onPageChange={setPage} />`,
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

  playground: {
    controls: paginationControls,
    render: (v) => <PaginationPreview key={String(v.pageCount)} values={v} />,
    code: (v) =>
      [
        'const [page, setPage] = useState(1);',
        '',
        '<Pagination',
        '  page={page}',
        '  pageCount={' + String(v.pageCount) + '}',
        '  onPageChange={setPage}',
        v.siblingCount !== '1' ? '  siblingCount={' + String(v.siblingCount) + '}' : '',
        str(v, 'label') && str(v, 'label') !== 'Paginação'
          ? '  ' + attr('label', str(v, 'label'))
          : '',
        '/>',
      ]
        .filter((line) => line !== '')
        .join('\n'),
  },
};
