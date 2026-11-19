import { useState, type FormEvent } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  EmptyState,
  Select,
  Skeleton,
  Switch,
  Tabs,
  TextField,
  useToast,
} from '../../../src';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAVE_DELAY_MS = 900;

interface ProfileErrors {
  name?: string;
  email?: string;
}

const validate = (name: string, email: string): ProfileErrors => ({
  name: name.trim() ? undefined : 'Informe seu nome.',
  email: EMAIL_PATTERN.test(email)
    ? undefined
    : 'Informe um e-mail válido, como maria@exemplo.com.',
});

function ProfileTab() {
  const { toast } = useToast();
  const [name, setName] = useState('Maria Silva');
  const [email, setEmail] = useState('maria@');
  const [language, setLanguage] = useState('pt-BR');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(name, email);
    setErrors(found);
    if (found.name || found.email) return;
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Perfil salvo',
        description: 'Suas alterações já estão valendo.',
        tone: 'success',
      });
    }, SAVE_DELAY_MS);
  };

  return (
    <form className="pg-form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nome"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
      />
      <TextField
        label="E-mail"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        description="Usamos para avisos de cobrança e segurança."
        error={errors.email}
      />
      <Select
        label="Idioma"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        options={[
          { value: 'pt-BR', label: 'Português (Brasil)' },
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
        ]}
      />
      <div className="pg-form__actions">
        <Button type="submit" loading={saving} loadingLabel="Salvando perfil">
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}

function NotificationsTab() {
  return (
    <div className="pg-stack pg-stack--lg">
      <Switch
        label="Resumo diário por e-mail"
        description="Enviado às 8h, no seu fuso horário."
        defaultChecked
      />
      <Switch
        label="Avisos de segurança"
        description="Novos acessos e alterações de senha."
        defaultChecked
      />
      <fieldset className="pg-fieldset">
        <legend>Canais extras</legend>
        <Checkbox label="Mensagem no celular" />
        <Checkbox label="Notificações no navegador" defaultChecked />
      </fieldset>
    </div>
  );
}

function DangerTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const confirm = () => {
    setOpen(false);
    toast({
      title: 'Conta marcada para exclusão',
      description: 'Você tem 7 dias para desfazer.',
      tone: 'warning',
    });
  };
  return (
    <>
      <p className="pg-note">Ações irreversíveis ficam isoladas e sempre pedem confirmação.</p>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Excluir conta
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        title="Excluir sua conta?"
        description="Seus projetos e dados serão apagados após 7 dias."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirm}>
              Excluir conta
            </Button>
          </>
        }
      />
    </>
  );
}

function TokensTab() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="pg-stack pg-stack--lg">
      <Switch label="Simular carregamento" checked={loading} onCheckedChange={setLoading} />
      {loading ? (
        <div className="pg-skeleton-demo" aria-busy="true">
          <span className="nui-visually-hidden">Carregando chaves de API</span>
          <Skeleton shape="rect" width={48} height={48} />
          <div className="pg-skeleton-demo__text">
            <Skeleton width="50%" />
            <Skeleton lines={2} />
          </div>
        </div>
      ) : (
        <EmptyState
          headingLevel={3}
          title="Nenhuma chave de API"
          description="Crie uma chave para integrar com seus sistemas."
          action={<Button size="sm">Criar chave</Button>}
        />
      )}
    </div>
  );
}

export function ComposedPage() {
  return (
    <>
      <header className="pg-page-head">
        <p className="pg-eyebrow">Exemplo composto</p>
        <h1 className="pg-h1" tabIndex={-1} id="page-title">
          Tela de configurações
        </h1>
        <p className="pg-lead">
          Montada só com componentes do Nasck UI: abas, campos com validação, switches, diálogo de
          confirmação, toasts, skeleton e estado vazio. Tente enviar o formulário com o e-mail
          inválido.
        </p>
      </header>

      <Card
        title="Conta"
        headingLevel={2}
        description="Gerencie perfil, avisos e dados da conta."
        className="pg-composed"
        footer={
          <span className="pg-composed__meta">
            Plano <Badge tone="accent">Pro</Badge> <Badge tone="success">Ativo</Badge>
          </span>
        }
      >
        <Tabs
          label="Configurações da conta"
          items={[
            { id: 'perfil', label: 'Perfil', content: <ProfileTab /> },
            { id: 'avisos', label: 'Avisos', content: <NotificationsTab /> },
            { id: 'api', label: 'API', content: <TokensTab /> },
            { id: 'risco', label: 'Risco', content: <DangerTab /> },
          ]}
        />
      </Card>
    </>
  );
}
