import { Switch } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { bool, str } from '../shared';

const switchControls: Control[] = [
  { name: 'label', kind: 'text', default: 'Notificações por e-mail' },
  { name: 'description', kind: 'text', default: 'Resumo diário às 8h.' },
  { name: 'defaultChecked', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

export const doc: ComponentDoc = {
  slug: 'switch',
  name: 'Switch',
  group: 'Formulários',
  summary:
    'Liga/desliga com efeito imediato, seguindo o padrão de interruptor do guia de acessibilidade do W3C (WAI-ARIA APG).',
  semantics: '<button role="switch" aria-checked>; rótulo por <label for>.',
  keyboard: [
    { keys: 'Espaço', action: 'Alterna o estado.' },
    { keys: 'Enter', action: 'Alterna o estado (é um botão real).' },
  ],
  aria: [
    'role="switch" com aria-checked refletindo o estado.',
    'Use Switch para efeito imediato; para escolhas confirmadas em um envio, use Checkbox.',
    'Funciona controlado (checked + onCheckedChange) ou não controlado (defaultChecked).',
  ],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Rótulo (obrigatório).' },
    { name: 'description', type: 'ReactNode', description: 'Texto de ajuda.' },
    {
      name: 'checked / defaultChecked',
      type: 'boolean',
      description: 'Estado controlado / inicial.',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      description: 'Chamado ao alternar.',
    },
  ],
  demos: [
    {
      title: 'Estados',
      preview: (
        <div className="pg-stack">
          <Switch
            label="Notificações por e-mail"
            description="Resumo diário às 8h."
            defaultChecked
          />
          <Switch label="Modo compacto" />
          <Switch label="Recurso indisponível" disabled />
        </div>
      ),
      code: `<Switch label="Notificações por e-mail" description="Resumo diário às 8h." defaultChecked />
<Switch label="Modo compacto" />
<Switch label="Recurso indisponível" disabled />`,
    },
  ],
  playground: {
    controls: switchControls,
    render: (v) => (
      <Switch
        key={String(v.defaultChecked)}
        label={str(v, 'label') || 'Opção'}
        description={str(v, 'description') || undefined}
        defaultChecked={bool(v, 'defaultChecked')}
        disabled={bool(v, 'disabled')}
      />
    ),
    code: (v) => generateJsx('Switch', switchControls, v, { always: ['label'] }),
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
};
