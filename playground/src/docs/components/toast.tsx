import { Button, type ToastOptions, type ToastTone, useToast } from '../../../../src';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { str } from '../shared';

function ToastButtons() {
  const { toast } = useToast();
  const fire = (options: ToastOptions) => () => toast(options);
  return (
    <div className="pg-row">
      <Button variant="secondary" onClick={fire({ title: 'Alterações salvas', tone: 'success' })}>
        Sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={fire({
          title: 'Conexão instável',
          description: 'Tentando de novo.',
          tone: 'warning',
        })}
      >
        Alerta
      </Button>
      <Button
        variant="secondary"
        onClick={fire({
          title: 'Falha ao enviar',
          description: 'Verifique sua rede.',
          tone: 'danger',
          duration: null,
        })}
      >
        Erro (fixo)
      </Button>
      <Button variant="secondary" onClick={fire({ title: 'Convite enviado' })}>
        Neutro
      </Button>
    </div>
  );
}

const toastControls: Control[] = [
  { name: 'title', kind: 'text', default: 'Alterações salvas' },
  { name: 'description', kind: 'text', default: 'Seu perfil foi atualizado.' },
  {
    name: 'tone',
    kind: 'select',
    options: ['neutral', 'success', 'warning', 'danger'],
    default: 'success',
  },
  { name: 'duration', kind: 'select', options: ['5000', '10000', 'nunca'], default: '5000' },
];

const durationOf = (v: ControlValues): number | null =>
  v.duration === 'nunca' ? null : Number(v.duration);

function ToastPreview({ values }: { values: ControlValues }) {
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast({
          title: str(values, 'title') || 'Aviso',
          tone: values.tone as ToastTone,
          description: str(values, 'description') || undefined,
          duration: durationOf(values),
        })
      }
    >
      Disparar toast
    </Button>
  );
}

export const doc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  group: 'Navegação e sobreposição',
  summary: 'Notificações não bloqueantes, anunciadas por leitor de tela sem roubar o foco.',
  semantics: 'ToastProvider mantém uma região role="status" (aria-live="polite") sempre montada.',
  keyboard: [
    { keys: 'Tab', action: 'Alcança o botão "Dispensar notificação" de cada toast.' },
    { keys: 'Enter / Espaço', action: 'Dispensa o toast.' },
    { keys: 'Esc', action: 'Dispensa o toast sob o foco ou o mouse (e não o diálogo atrás dele).' },
    {
      keys: 'Mouse ou foco sobre o toast',
      action: 'Pausa a contagem do fechamento automático; ela volta ao sair.',
    },
  ],
  aria: [
    'A região live existe antes do primeiro toast, para que o anúncio não se perca.',
    'O foco nunca é movido para o toast.',
    'Fecha sozinho em 5 s; duration: null mantém até ser dispensado (use em erros).',
    'useToast() só funciona dentro de <ToastProvider>; fora, lança um erro explicativo.',
  ],
  props: [
    {
      name: 'toast(options)',
      type: 'ToastOptions',
      description: '{ title, description?, tone?, duration? }; devolve o id.',
    },
    { name: 'dismiss(id)', type: '(id: number) => void', description: 'Remove um toast.' },
    {
      name: 'tone',
      type: "'neutral' | 'success' | 'warning' | 'danger'",
      description: 'Cor semântica. Padrão: neutral.',
    },
  ],
  demos: [
    {
      title: 'Tons e duração',
      note: 'Os toasts aparecem no canto inferior da tela.',
      preview: <ToastButtons />,
      code: `const { toast } = useToast();

<Button
  onClick={() => toast({ title: 'Alterações salvas', tone: 'success' })}
>
  Salvar
</Button>
<Button
  variant="danger"
  onClick={() =>
    toast({
      title: 'Falha ao enviar',
      description: 'Verifique sua rede.',
      tone: 'danger',
      duration: null,
    })
  }
>
  Enviar
</Button>`,
    },
  ],
  playground: {
    controls: toastControls,
    render: (v) => <ToastPreview values={v} />,
    code: (v) =>
      [
        'const { toast } = useToast();',
        '',
        '<Button',
        '  onClick={() =>',
        '    toast({',
        '      title: ' + JSON.stringify(str(v, 'title')) + ',',
        str(v, 'description')
          ? '      description: ' + JSON.stringify(str(v, 'description')) + ','
          : '',
        '      tone: ' + JSON.stringify(String(v.tone)) + ',',
        v.duration !== '5000' ? '      duration: ' + String(durationOf(v)) + ',' : '',
        '    })',
        '  }',
        '>',
        '  Disparar toast',
        '</Button>',
      ]
        .filter((line) => line !== '')
        .join('\n'),
  },
  anatomyStage: (
    <ol className="nui-toast-list" style={{ maxWidth: '24rem' }}>
      <li className="nui-toast" data-tone="success" style={{ animation: 'none' }}>
        <div className="nui-toast__content">
          <p className="nui-toast__title">Alterações salvas</p>
          <p className="nui-toast__description">Seu perfil foi atualizado.</p>
        </div>
      </li>
    </ol>
  ),
  anatomy: [
    {
      label: 'Título',
      description: 'A frase anunciada pela região viva.',
      selector: '.nui-toast__title',
    },
    { label: 'Descrição', description: 'Detalhe opcional.', selector: '.nui-toast__description' },
    {
      label: 'Faixa de tom',
      description: 'A cor é reforçada pelo texto, nunca sozinha.',
      selector: '.nui-toast',
    },
  ],
  dos: [{ text: 'Use para confirmar ações que o usuário acabou de fazer.' }],
  donts: [
    { text: 'Não use toast para erros que exigem ação: mostre junto ao campo.' },
    { text: 'Não coloque botões essenciais dentro do toast.' },
  ],
};
