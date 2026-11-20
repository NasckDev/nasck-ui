import { Select } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { bool, csv, optionObjects, optionsSource, str } from '../shared';

const countries = [
  { value: 'br', label: 'Brasil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ar', label: 'Argentina', disabled: true },
];

const selectControls: Control[] = [
  { name: 'label', kind: 'text', default: 'Cidade' },
  { name: 'placeholder', kind: 'text', default: 'Escolha uma cidade' },
  { name: 'description', kind: 'text', default: '' },
  { name: 'error', kind: 'text', default: '' },
  { name: 'options', kind: 'text', default: 'São Paulo, Rio de Janeiro, Belo Horizonte' },
  { name: 'required', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

export const doc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  group: 'Formulários',
  summary:
    'Seleção única sobre o <select> nativo: teclado, seletor móvel e leitor de tela de graça.',
  semantics: '<label for> + <select> nativos; opções e placeholder como <option>.',
  keyboard: [
    { keys: '↑ / ↓', action: 'Muda a opção (comportamento nativo).' },
    { keys: 'Digitação', action: 'Salta para a opção que começa com as letras digitadas.' },
    { keys: 'Alt+↓ / Espaço', action: 'Abre a lista, conforme o navegador.' },
  ],
  aria: [
    'Sem reimplementação de listbox: a semântica vem do elemento nativo.',
    'description e error entram em aria-describedby; error define aria-invalid.',
    'No celular, abre o seletor do sistema.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Rótulo (obrigatório).' },
    { name: 'options', type: 'SelectOption[]', description: '{ value, label, disabled? }.' },
    { name: 'placeholder', type: 'string', description: 'Renderiza uma primeira opção vazia.' },
    { name: 'description / error', type: 'ReactNode', description: 'Ajuda e mensagem de erro.' },
  ],
  demos: [
    {
      title: 'Padrão',
      preview: (
        <Select
          label="País"
          options={countries}
          placeholder="Selecione"
          description="Onde você reside."
        />
      ),
      code: `<Select
  label="País"
  placeholder="Selecione"
  description="Onde você reside."
  options={countries}
/>`,
      setup: `const countries = [
  { value: 'br', label: 'Brasil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ar', label: 'Argentina', disabled: true },
];`,
    },
    {
      title: 'Erro e desabilitado',
      preview: (
        <div className="pg-stack">
          <Select
            label="País"
            options={countries}
            placeholder="Selecione"
            required
            error="Escolha um país."
          />
          <Select label="Região" options={countries} disabled />
        </div>
      ),
      code: `<Select label="País" options={countries} required error="Escolha um país." />
<Select label="Região" options={countries} disabled />`,
      setup: `const countries = [
  { value: 'br', label: 'Brasil' },
  { value: 'pt', label: 'Portugal' },
];`,
    },
  ],
  playground: {
    controls: selectControls,
    render: (v) => (
      <Select
        label={str(v, 'label') || 'Campo'}
        options={optionObjects(csv(v, 'options'))}
        placeholder={str(v, 'placeholder') || undefined}
        description={str(v, 'description') || undefined}
        error={str(v, 'error') || undefined}
        required={bool(v, 'required')}
        disabled={bool(v, 'disabled')}
      />
    ),
    setup: (v) => optionsSource(csv(v, 'options')),
    code: (v) =>
      generateJsx('Select', selectControls, v, {
        always: ['label'],
        skip: ['options'],
        fixed: ['options={options}'],
      }),
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
};
