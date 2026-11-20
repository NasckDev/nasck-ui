import { generateJsx } from '../../lib/codegen';
import { Button, IconButton, Tooltip } from '../../../../src';
import { type ComponentDoc, type Control } from '../types';
import { Info } from 'lucide-react';
import { str } from '../shared';

const tooltipControls: Control[] = [
  { name: 'content', kind: 'text', default: 'Salva o rascunho sem publicar' },
  { name: 'placement', kind: 'select', options: ['top', 'bottom'], default: 'top' },
];

export const doc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  group: 'Navegação e sobreposição',
  summary: 'Dica contextual no hover e no foco do teclado, ligada ao gatilho por aria-describedby.',
  semantics: 'role="tooltip" referenciado por aria-describedby no elemento focável.',
  keyboard: [
    { keys: 'Foco (Tab)', action: 'Mostra a dica.' },
    { keys: 'Esc', action: 'Fecha a dica sem tirar o foco do gatilho.' },
    { keys: 'Blur / mouse sai', action: 'Esconde a dica.' },
  ],
  aria: [
    'Só texto suplementar: nunca coloque informação essencial ou conteúdo interativo na dica.',
    'Preserva um aria-describedby que já exista no gatilho.',
    'O filho precisa ser um único elemento focável.',
  ],
  props: [
    { name: 'content', type: 'ReactNode', description: 'Texto da dica (obrigatório).' },
    { name: 'children', type: 'ReactElement', description: 'Gatilho focável (obrigatório).' },
    { name: 'placement', type: "'top' | 'bottom'", description: 'Posição. Padrão: top.' },
  ],
  demos: [
    {
      title: 'Em botões',
      note: 'Passe o mouse ou use Tab; Esc fecha.',
      preview: (
        <div className="pg-row pg-row--tooltips">
          <Tooltip content="Salva o rascunho sem publicar">
            <Button variant="secondary">Salvar</Button>
          </Tooltip>
          <Tooltip content="Mais informações" placement="bottom">
            <IconButton label="Ajuda" icon={<Info size={16} />} variant="secondary" />
          </Tooltip>
        </div>
      ),
      code: `<Tooltip content="Salva o rascunho sem publicar">
  <Button variant="secondary">Salvar</Button>
</Tooltip>
<Tooltip content="Mais informações" placement="bottom">
  <IconButton label="Ajuda" icon={<Info size={16} />} variant="secondary" />
</Tooltip>`,
    },
  ],
  playground: {
    controls: tooltipControls,
    render: (v) => (
      <Tooltip content={str(v, 'content') || 'Dica'} placement={v.placement as 'top' | 'bottom'}>
        <Button variant="secondary">Passe o mouse ou foque</Button>
      </Tooltip>
    ),
    code: (v) =>
      generateJsx('Tooltip', tooltipControls, v, { always: ['content'] }).replace(
        / \/>$|\n\/>$/,
        '>\n  <Button variant="secondary">Salvar</Button>\n</Tooltip>',
      ),
  },
  anatomyStage: (
    <div style={{ paddingTop: '2.5rem' }}>
      <span className="nui-tooltip">
        <Button variant="secondary" tabIndex={-1}>
          Gatilho
        </Button>
        <span
          className="nui-tooltip__bubble"
          role="presentation"
          style={{ animation: 'none', position: 'static', transform: 'none' }}
        >
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
};
