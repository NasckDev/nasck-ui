import { Checkbox } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { bool, str } from '../shared';

const checkboxControls: Control[] = [
  { name: 'label', kind: 'text', default: 'Receber resumo semanal' },
  { name: 'description', kind: 'text', default: 'Enviado às segundas.' },
  { name: 'error', kind: 'text', default: '' },
  { name: 'defaultChecked', kind: 'boolean', default: false },
  { name: 'indeterminate', kind: 'boolean', default: false },
  { name: 'required', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

export const doc: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  group: 'Formulários',
  summary: 'Caixa de seleção nativa com rótulo clicável, descrição, erro e estado misto.',
  semantics: '<input type="checkbox"> + <label>; indeterminate definido via propriedade do DOM.',
  keyboard: [
    { keys: 'Espaço', action: 'Alterna marcado / desmarcado.' },
    { keys: 'Tab', action: 'Move o foco.' },
  ],
  aria: [
    'O estado misto (indeterminate) é exposto como aria-checked="mixed" pelo navegador.',
    'Descrição e erro entram em aria-describedby.',
    'O rótulo faz parte da área clicável.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Rótulo (obrigatório).' },
    { name: 'description / error', type: 'ReactNode', description: 'Ajuda e mensagem de erro.' },
    {
      name: 'indeterminate',
      type: 'boolean',
      description: 'Estado misto, ex.: "selecionar tudo" parcial.',
    },
  ],
  demos: [
    {
      title: 'Estados',
      preview: (
        <div className="pg-stack">
          <Checkbox label="Receber novidades" description="No máximo uma vez por mês." />
          <Checkbox label="Marcado" defaultChecked />
          <Checkbox label="Selecionar tudo (parcial)" indeterminate />
          <Checkbox label="Desabilitado" disabled />
        </div>
      ),
      code: `<Checkbox label="Receber novidades" description="No máximo uma vez por mês." />
<Checkbox label="Marcado" defaultChecked />
<Checkbox label="Selecionar tudo (parcial)" indeterminate />
<Checkbox label="Desabilitado" disabled />`,
    },
    {
      title: 'Erro',
      preview: (
        <Checkbox label="Aceito os termos de uso" error="Você precisa aceitar para continuar." />
      ),
      code: `<Checkbox label="Aceito os termos de uso" error="Você precisa aceitar para continuar." />`,
    },
  ],
  playground: {
    controls: checkboxControls,
    render: (v) => (
      <Checkbox
        key={String(v.defaultChecked)}
        label={str(v, 'label') || 'Opção'}
        description={str(v, 'description') || undefined}
        error={str(v, 'error') || undefined}
        defaultChecked={bool(v, 'defaultChecked')}
        indeterminate={bool(v, 'indeterminate')}
        required={bool(v, 'required')}
        disabled={bool(v, 'disabled')}
      />
    ),
    code: (v) => generateJsx('Checkbox', checkboxControls, v, { always: ['label'] }),
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
};
