import { useRef, useState } from 'react';
import { Button, Dialog } from '../../../../src';
import { type ComponentDoc, type Control, type ControlValues } from '../types';
import { attr, str } from '../shared';

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

const dialogControls: Control[] = [
  { name: 'title', kind: 'text', default: 'Convidar pessoas' },
  { name: 'description', kind: 'text', default: 'Elas recebem um e-mail com o link de acesso.' },
  { name: 'confirmLabel', kind: 'text', default: 'Enviar convites' },
  { name: 'role', kind: 'select', options: ['dialog', 'alertdialog'], default: 'dialog' },
];

function DialogPreview({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  const destructive = values.role === 'alertdialog';
  return (
    <>
      <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role={destructive ? 'alertdialog' : 'dialog'}
        title={str(values, 'title') || 'Diálogo'}
        description={str(values, 'description') || undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant={destructive ? 'danger' : 'primary'} onClick={() => setOpen(false)}>
              {str(values, 'confirmLabel') || 'Confirmar'}
            </Button>
          </>
        }
      />
    </>
  );
}

export const doc: ComponentDoc = {
  slug: 'dialog',
  name: 'Dialog',
  group: 'Navegação e sobreposição',
  summary: 'Diálogo modal com foco preso, fundo inerte e retorno de foco ao gatilho.',
  semantics: 'role="dialog" (ou "alertdialog") com aria-modal, aria-labelledby e aria-describedby.',
  keyboard: [
    {
      keys: 'Esc',
      action:
        'Fecha o diálogo. Se houver um menu, lista ou dica aberta dentro dele, Esc fecha primeiro só essa camada.',
    },
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
      code: `const [open, setOpen] = useState(false);
const cancelRef = useRef<HTMLButtonElement>(null);

<Button variant="danger" onClick={() => setOpen(true)}>Excluir projeto</Button>
<Dialog
  open={open}
  onOpenChange={setOpen}
  role="alertdialog"
  title="Excluir este projeto?"
  description="Todos os arquivos e histórico serão apagados."
  initialFocusRef={cancelRef}
  footer={
    <>
      <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={() => setOpen(false)}>
        Excluir
      </Button>
    </>
  }
/>`,
    },
  ],
  playground: {
    controls: dialogControls,
    render: (v) => <DialogPreview values={v} />,
    code: (v) => {
      const destructive = v.role === 'alertdialog';
      return [
        'const [open, setOpen] = useState(false);',
        '',
        '<Button onClick={() => setOpen(true)}>Abrir diálogo</Button>',
        '<Dialog',
        '  open={open}',
        '  onOpenChange={setOpen}',
        destructive ? '  role="alertdialog"' : '',
        '  ' + attr('title', str(v, 'title')),
        str(v, 'description') ? '  ' + attr('description', str(v, 'description')) : '',
        '  footer={',
        '    <>',
        '      <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>',
        '      <Button variant="' +
          (destructive ? 'danger' : 'primary') +
          '" onClick={() => setOpen(false)}>',
        '        ' + str(v, 'confirmLabel'),
        '      </Button>',
        '    </>',
        '  }',
        '/>',
      ]
        .filter((line) => line !== '')
        .join('\n');
    },
  },
  anatomyStage: (
    <div className="nui-dialog" style={{ animation: 'none', maxWidth: '24rem' }}>
      <header className="nui-dialog__header">
        <h3 className="nui-dialog__title">Excluir projeto?</h3>
      </header>
      <p className="nui-dialog__description">Isso apaga os arquivos e não dá para desfazer.</p>
      <div className="nui-dialog__body">Conteúdo opcional.</div>
      <footer className="nui-dialog__footer">
        <Button variant="secondary" size="sm" tabIndex={-1}>
          Cancelar
        </Button>
        <Button variant="danger" size="sm" tabIndex={-1}>
          Excluir
        </Button>
      </footer>
    </div>
  ),
  anatomy: [
    {
      label: 'Título',
      description: 'Nomeia o diálogo (aria-labelledby).',
      selector: '.nui-dialog__title',
    },
    {
      label: 'Descrição',
      description: 'Contexto lido ao abrir (aria-describedby).',
      selector: '.nui-dialog__description',
    },
    {
      label: 'Rodapé',
      description: 'Ações; a destrutiva nunca recebe o foco inicial.',
      selector: '.nui-dialog__footer',
    },
  ],
  dos: [
    { text: 'Use alertdialog para confirmações destrutivas e foque Cancelar.' },
    { text: 'Devolva o foco a quem abriu ao fechar (já é automático).' },
  ],
  donts: [
    { text: 'Não abra diálogos sem ação do usuário.' },
    { text: 'Não empilhe um diálogo dentro de outro.' },
  ],
};
