import { Checkbox, Select, Switch, TextField } from '../../../src';
import type { ComponentDoc } from './types';

const countries = [
  { value: 'br', label: 'Brasil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'ar', label: 'Argentina', disabled: true },
];

export const formDocs: readonly ComponentDoc[] = [
  {
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
  },
  {
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
  },
  {
    slug: 'switch',
    name: 'Switch',
    group: 'Formulários',
    summary: 'Liga/desliga com efeito imediato, seguindo o padrão Switch da WAI-ARIA APG.',
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
  },
  {
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
  options={[
    { value: 'br', label: 'Brasil' },
    { value: 'pt', label: 'Portugal' },
    { value: 'ar', label: 'Argentina', disabled: true },
  ]}
/>`,
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
      },
    ],
  },
];
