import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  IconButton,
  Tabs,
  Tooltip,
  useToast,
  type ToastOptions,
} from '../../../src';
import type { ComponentDoc } from './types';

const tabItems = [
  { id: 'resumo', label: 'Resumo', content: 'Visão geral do projeto, com métricas da semana.' },
  { id: 'atividade', label: 'Atividade', content: 'Histórico de alterações recentes.' },
  { id: 'faturamento', label: 'Faturamento', content: 'Indisponível neste plano.', disabled: true },
  { id: 'ajustes', label: 'Ajustes', content: 'Preferências e integrações.' },
];

function DialogDemo({ destructive = false }: { destructive?: boolean }) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        {destructive ? 'Excluir projeto' : 'Abrir diálogo'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role={destructive ? 'alertdialog' : 'dialog'}
        title={destructive ? 'Excluir este projeto?' : 'Convidar pessoas'}
        description={
          destructive
            ? 'Todos os arquivos e histórico serão apagados. Não dá para desfazer.'
            : 'Elas recebem um e-mail com o link de acesso.'
        }
        initialFocusRef={destructive ? cancelRef : undefined}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(false)}>
              {destructive ? 'Excluir' : 'Enviar convites'}
            </Button>
          </>
        }
      >
        {destructive
          ? null
          : 'Use Tab e Shift+Tab: o foco fica preso aqui até você fechar com Esc.'}
      </Dialog>
    </>
  );
}

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

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M8 7.5v3.5M8 5v.01" strokeLinecap="round" />
  </svg>
);

export const overlayDocs: readonly ComponentDoc[] = [
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Navegação e sobreposição',
    summary: 'Abas com ativação automática, seguindo o padrão Tabs da WAI-ARIA APG.',
    semantics: 'role="tablist" > role="tab" + role="tabpanel"; roving tabindex.',
    keyboard: [
      {
        keys: '← / →',
        action: 'Move e ativa a aba anterior / seguinte, dando a volta nas pontas.',
      },
      { keys: 'Home / End', action: 'Vai para a primeira / última aba habilitada.' },
      { keys: 'Tab', action: 'Entra na lista (aba ativa) e depois no painel.' },
    ],
    aria: [
      'Cada aba tem aria-selected e aria-controls; cada painel tem aria-labelledby apontando para a aba.',
      'Roving tabindex: só a aba ativa está na ordem de tabulação.',
      'Abas desabilitadas são puladas na navegação por setas.',
      'label da lista vira aria-label do tablist.',
    ],
    props: [
      {
        name: 'label',
        type: 'string',
        description: 'Nome acessível da lista de abas (obrigatório).',
      },
      { name: 'items', type: 'TabItem[]', description: '{ id, label, content, disabled? }.' },
      {
        name: 'value / defaultValue',
        type: 'string',
        description: 'Aba ativa controlada / inicial.',
      },
      {
        name: 'onValueChange',
        type: '(id: string) => void',
        description: 'Chamado ao trocar de aba.',
      },
    ],
    demos: [
      {
        title: 'Com aba desabilitada',
        note: 'Foque uma aba e use as setas: "Faturamento" é pulada.',
        preview: <Tabs label="Seções do projeto" items={tabItems} />,
        code: `<Tabs
  label="Seções do projeto"
  items={[
    { id: 'resumo', label: 'Resumo', content: '...' },
    { id: 'atividade', label: 'Atividade', content: '...' },
    { id: 'faturamento', label: 'Faturamento', content: '...', disabled: true },
    { id: 'ajustes', label: 'Ajustes', content: '...' },
  ]}
/>`,
      },
    ],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'Navegação e sobreposição',
    summary: 'Diálogo modal com foco preso, fundo inerte e retorno de foco ao gatilho.',
    semantics:
      'role="dialog" (ou "alertdialog") com aria-modal, aria-labelledby e aria-describedby.',
    keyboard: [
      { keys: 'Esc', action: 'Fecha o diálogo.' },
      { keys: 'Tab / Shift+Tab', action: 'Circula só entre os controles do diálogo.' },
      { keys: 'Clique no fundo', action: 'Fecha (conveniência para mouse).' },
    ],
    aria: [
      'Título vira aria-labelledby; descrição, aria-describedby.',
      'O restante da página recebe inert enquanto o diálogo está aberto.',
      'Ao fechar, o foco volta ao elemento que abriu.',
      'Use role="alertdialog" e initialFocusRef no botão seguro para confirmações destrutivas.',
      'Renderizado em portal, fora de qualquer overflow ou stacking context.',
    ],
    props: [
      {
        name: 'open / onOpenChange',
        type: 'boolean / (open: boolean) => void',
        description: 'Estado controlado (obrigatório).',
      },
      { name: 'title', type: 'ReactNode', description: 'Título (obrigatório).' },
      {
        name: 'description / footer',
        type: 'ReactNode',
        description: 'Texto de apoio e área de ações.',
      },
      {
        name: 'initialFocusRef',
        type: 'RefObject<HTMLElement>',
        description: 'Elemento focado ao abrir.',
      },
      { name: 'role', type: "'dialog' | 'alertdialog'", description: 'Padrão: dialog.' },
      {
        name: 'closeLabel',
        type: 'string',
        description: 'Nome do botão de fechar. Padrão: "Fechar".',
      },
    ],
    demos: [
      {
        title: 'Diálogo simples',
        preview: <DialogDemo />,
        code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Convidar pessoas"
  description="Elas recebem um e-mail com o link de acesso."
  footer={<Button onClick={() => setOpen(false)}>Enviar convites</Button>}
>
  Conteúdo
</Dialog>`,
      },
      {
        title: 'Confirmação destrutiva',
        note: 'alertdialog com o foco inicial no botão seguro (Cancelar).',
        preview: <DialogDemo destructive />,
        code: `const cancelRef = useRef<HTMLButtonElement>(null);

<Dialog
  open={open}
  onOpenChange={setOpen}
  role="alertdialog"
  title="Excluir este projeto?"
  description="Todos os arquivos e histórico serão apagados."
  initialFocusRef={cancelRef}
  footer={
    <>
      <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button variant="danger">Excluir</Button>
    </>
  }
/>`,
      },
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    group: 'Navegação e sobreposição',
    summary: 'Notificações não bloqueantes, anunciadas por leitor de tela sem roubar o foco.',
    semantics: 'ToastProvider mantém uma região role="status" (aria-live="polite") sempre montada.',
    keyboard: [
      { keys: 'Tab', action: 'Alcança o botão "Dispensar notificação" de cada toast.' },
      { keys: 'Enter / Espaço', action: 'Dispensa o toast.' },
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
        code: `// <ToastProvider> na raiz do app
const { toast } = useToast();

toast({ title: 'Alterações salvas', tone: 'success' });
toast({ title: 'Falha ao enviar', description: 'Verifique sua rede.', tone: 'danger', duration: null });`,
      },
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    group: 'Navegação e sobreposição',
    summary:
      'Dica contextual no hover e no foco do teclado, ligada ao gatilho por aria-describedby.',
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
              <IconButton label="Ajuda" icon={<InfoIcon />} variant="secondary" />
            </Tooltip>
          </div>
        ),
        code: `<Tooltip content="Salva o rascunho sem publicar">
  <Button variant="secondary">Salvar</Button>
</Tooltip>
<Tooltip content="Mais informações" placement="bottom">
  <IconButton label="Ajuda" icon={<InfoIcon />} variant="secondary" />
</Tooltip>`,
      },
    ],
  },
];
