import { AlertTriangle, Camera, Mail, Plus } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Card,
  Combobox,
  Dialog,
  Menu,
  Select,
  Switch,
  Tabs,
  TextField,
  useToast,
} from '../../../../src';

const CITIES = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'bh', label: 'Belo Horizonte' },
  { value: 'cwb', label: 'Curitiba' },
  { value: 'poa', label: 'Porto Alegre' },
  { value: 'ssa', label: 'Salvador' },
];

const MEMBERS = [
  { name: 'Marina Duarte', email: 'marina@lumen.com.br', role: 'Administradora' },
  { name: 'Caio Fernandes', email: 'caio@lumen.com.br', role: 'Financeiro' },
  { name: 'Beatriz Nogueira', email: 'beatriz@lumen.com.br', role: 'Leitura' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;
  email?: string;
}

const validate = (name: string, email: string): FormErrors => ({
  name: name.trim().length < 3 ? 'Informe seu nome completo, com pelo menos 3 letras.' : undefined,
  email: EMAIL_PATTERN.test(email)
    ? undefined
    : 'Informe um e-mail válido, como nome@empresa.com.br.',
});

function ProfileForm() {
  const { toast } = useToast();
  const [name, setName] = useState('Marina Duarte');
  const [email, setEmail] = useState('marina@lumen');
  const [errors, setErrors] = useState<FormErrors>({});
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
        title: 'Perfil atualizado',
        description: 'As alterações já valem para toda a equipe.',
        tone: 'success',
      });
    }, 900);
  };

  return (
    <form className="tpl-form" onSubmit={handleSubmit} noValidate aria-label="Perfil">
      <div className="tpl-profile">
        <Avatar name={name || 'Sem nome'} size="lg" />
        <div>
          <strong>Foto do perfil</strong>
          <p className="tpl-sub">PNG ou JPG, até 2 MB.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          startIcon={<Camera size={16} aria-hidden="true" />}
        >
          Trocar foto
        </Button>
      </div>
      <TextField
        label="Nome completo"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
        required
        autoComplete="name"
      />
      <TextField
        label="E-mail de trabalho"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        description="Usado para entrar e receber avisos."
        error={errors.email}
        required
        autoComplete="email"
      />
      <div className="tpl-form__row">
        <Select
          label="Idioma"
          defaultValue="pt-BR"
          options={[
            { value: 'pt-BR', label: 'Português (Brasil)' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
        />
        <Combobox label="Cidade" options={CITIES} defaultValue="sp" />
      </div>
      <div className="tpl-form__actions">
        <Button type="submit" loading={saving} loadingLabel="Salvando alterações">
          Salvar alterações
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            setName('Marina Duarte');
            setEmail('marina@lumen.com.br');
            setErrors({});
          }}
        >
          Descartar
        </Button>
      </div>
    </form>
  );
}

function NotificationsPanel() {
  const { toast } = useToast();
  const items = [
    { label: 'Faturas vencendo', description: 'Aviso 3 dias antes do vencimento.', on: true },
    {
      label: 'Resumo semanal por e-mail',
      description: 'Enviado às segundas-feiras, às 8h.',
      on: true,
    },
    { label: 'Novidades do produto', description: 'No máximo uma mensagem por mês.', on: false },
  ];
  return (
    <div className="tpl-stack">
      {items.map((item) => (
        <Switch
          key={item.label}
          label={item.label}
          description={item.description}
          defaultChecked={item.on}
          onCheckedChange={(checked) =>
            toast({ title: `${item.label}: ${checked ? 'ligado' : 'desligado'}`, tone: 'neutral' })
          }
        />
      ))}
      <Accordion
        items={[
          {
            id: 'q1',
            title: 'Quando os avisos são enviados?',
            content: 'Avisos de fatura saem às 9h no fuso de Brasília.',
          },
          {
            id: 'q2',
            title: 'Posso receber só no celular?',
            content: 'Ainda não. Por enquanto os avisos chegam por e-mail.',
          },
        ]}
      />
    </div>
  );
}

function TeamPanel() {
  const { toast } = useToast();
  return (
    <div className="tpl-stack">
      <ul className="tpl-members">
        {MEMBERS.map((member) => (
          <li key={member.email} className="tpl-member">
            <Avatar name={member.name} />
            <span className="tpl-member__text">
              <strong>{member.name}</strong>
              <small>
                <Mail size={12} aria-hidden="true" /> {member.email}
              </small>
            </span>
            <Badge tone={member.role === 'Administradora' ? 'accent' : 'neutral'}>
              {member.role}
            </Badge>
            <Menu
              label={`Ações de ${member.name}`}
              iconOnly
              size="sm"
              align="end"
              variant="ghost"
              icon={<span aria-hidden="true">⋯</span>}
              items={[
                {
                  id: 'role',
                  label: 'Mudar papel',
                  onSelect: () => toast({ title: 'Papel atualizado', tone: 'success' }),
                },
                {
                  id: 'rm',
                  label: 'Remover da equipe',
                  tone: 'danger',
                  separatorBefore: true,
                  onSelect: () => toast({ title: `${member.name} foi removida`, tone: 'warning' }),
                },
              ]}
            />
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        startIcon={<Plus size={16} aria-hidden="true" />}
        onClick={() =>
          toast({
            title: 'Convite enviado',
            description: 'O link vale por 7 dias.',
            tone: 'success',
          })
        }
      >
        Convidar pessoa
      </Button>
    </div>
  );
}

function DangerZone() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Card title="Zona de risco" headingLevel={3} className="tpl-danger">
      <p className="tpl-sub">
        Excluir a conta apaga faturas, clientes e histórico. Exportamos um backup antes, mas a ação
        não pode ser desfeita.
      </p>
      <Button
        variant="danger"
        startIcon={<AlertTriangle size={16} aria-hidden="true" />}
        onClick={() => setOpen(true)}
      >
        Excluir minha conta
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        title="Excluir a conta Lumen Estúdio?"
        description="Todos os dados serão apagados em 30 dias. Você pode cancelar antes disso entrando de novo."
        initialFocusRef={cancelRef}
        footer={
          <>
            <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false);
                toast({
                  title: 'Exclusão agendada',
                  description: 'A conta será apagada em 30 dias.',
                  tone: 'danger',
                });
              }}
            >
              Excluir conta
            </Button>
          </>
        }
      />
    </Card>
  );
}

export function SettingsTemplate() {
  return (
    <div className="tpl tpl-settings">
      <header className="tpl-settings__head">
        <h2 className="tpl-h">Configurações</h2>
        <p className="tpl-sub">Gerencie seu perfil, avisos e equipe.</p>
      </header>
      <div className="tpl-settings__layout">
        <Card title="Sua conta" headingLevel={3} className="tpl-account">
          <div className="tpl-account__who">
            <Avatar name="Lumen Estúdio" size="lg" />
            <span>
              <strong>Lumen Estúdio</strong>
              <small>Plano Equipe</small>
            </span>
          </div>
          <dl className="tpl-account__facts">
            <div>
              <dt>Pessoas</dt>
              <dd>3 de 5</dd>
            </div>
            <div>
              <dt>Próxima cobrança</dt>
              <dd>05 dez 2026</dd>
            </div>
            <div>
              <dt>Situação</dt>
              <dd>
                <Badge tone="success">Em dia</Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Tabs
          label="Seções de configurações"
          items={[
            {
              id: 'perfil',
              label: 'Perfil',
              content: (
                <Card title="Seu perfil" headingLevel={3}>
                  <ProfileForm />
                </Card>
              ),
            },
            {
              id: 'avisos',
              label: 'Notificações',
              content: (
                <Card title="Notificações" headingLevel={3}>
                  <NotificationsPanel />
                </Card>
              ),
            },
            {
              id: 'equipe',
              label: 'Equipe',
              content: (
                <Card title="Pessoas com acesso" headingLevel={3}>
                  <TeamPanel />
                </Card>
              ),
            },
            { id: 'risco', label: 'Conta', content: <DangerZone /> },
          ]}
        />
      </div>
    </div>
  );
}
