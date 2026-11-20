import { TextField } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { bool, str } from '../shared';

const fieldControls: Control[] = [
  { name: 'label', kind: 'text', default: 'E-mail' },
  { name: 'type', kind: 'select', options: ['text', 'email', 'password'], default: 'text' },
  { name: 'placeholder', kind: 'text', default: '' },
  { name: 'description', kind: 'text', default: 'Usamos só para avisos da conta.' },
  { name: 'error', kind: 'text', default: '' },
  { name: 'required', kind: 'boolean', default: false },
  { name: 'disabled', kind: 'boolean', default: false },
];

export const doc: ComponentDoc = {
  slug: 'text-field',
  name: 'TextField',
  group: 'Formulários',
  summary:
    'Campo de texto com rótulo sempre visível, descrição e mensagem de erro ligadas ao input.',
  semantics:
    '<label for> + <input> nativos; descrição e erro por aria-describedby; aria-invalid no erro.',
  keyboard: [
    { keys: 'Tab', action: 'Foca o campo.' },
    { keys: 'Digitação', action: 'Comportamento nativo do input.' },
  ],
  aria: [
    'label é obrigatório: placeholder não substitui rótulo.',
    'description e error entram em aria-describedby, nessa ordem.',
    'error define aria-invalid="true" e troca a cor da borda; a cor nunca é o único sinal, a mensagem aparece em texto.',
    'required mostra um asterisco decorativo (aria-hidden); o atributo nativo é anunciado.',
  ],
  props: [
    { name: 'label', type: 'ReactNode', description: 'Rótulo visível (obrigatório).' },
    { name: 'description', type: 'ReactNode', description: 'Texto de ajuda.' },
    { name: 'error', type: 'ReactNode', description: 'Mensagem de erro; ativa aria-invalid.' },
    {
      name: '...input',
      type: 'ComponentPropsWithRef<"input">',
      description: 'Demais props nativas (type, required, disabled...).',
    },
  ],
  demos: [
    {
      title: 'Padrão com descrição',
      preview: (
        <TextField
          label="Nome completo"
          description="Como aparece no seu perfil."
          placeholder="Maria Silva"
        />
      ),
      code: `<TextField
  label="Nome completo"
  description="Como aparece no seu perfil."
/>`,
    },
    {
      title: 'Obrigatório',
      preview: <TextField label="E-mail" type="email" required placeholder="voce@exemplo.com" />,
      code: `<TextField label="E-mail" type="email" required />`,
    },
    {
      title: 'Erro',
      note: 'aria-invalid e a mensagem de erro vinculada por aria-describedby.',
      preview: (
        <TextField
          label="E-mail"
          type="email"
          defaultValue="maria@"
          description="Usamos só para avisos de cobrança."
          error="Informe um e-mail válido, como maria@exemplo.com."
        />
      ),
      code: `<TextField
  label="E-mail"
  type="email"
  error="Informe um e-mail válido, como maria@exemplo.com."
/>`,
    },
    {
      title: 'Desabilitado',
      preview: <TextField label="Plano" defaultValue="Gratuito" disabled />,
      code: `<TextField label="Plano" defaultValue="Gratuito" disabled />`,
    },
  ],
  playground: {
    controls: fieldControls,
    render: (v) => (
      <TextField
        label={str(v, 'label') || 'Campo'}
        type={str(v, 'type')}
        placeholder={str(v, 'placeholder') || undefined}
        description={str(v, 'description') || undefined}
        error={str(v, 'error') || undefined}
        required={bool(v, 'required')}
        disabled={bool(v, 'disabled')}
      />
    ),
    code: (v) => generateJsx('TextField', fieldControls, v, { always: ['label'] }),
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
};
