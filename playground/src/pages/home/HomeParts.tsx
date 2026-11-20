import { ArrowRight, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import {
  AvatarGroup,
  Button,
  Menu,
  Card,
  Select,
  Switch,
  TextField,
  useToast,
} from '../../../../src';
import { copyText } from '../../components/CodeBlock';

import { href } from '../../router';

export const INSTALL = 'npm install github:NasckDev/nasck-ui';

export function Tile({
  title,
  to,
  className,
  children,
}: {
  title: string;
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`pg-tile ${className ?? ''}`} aria-label={title}>
      <header className="pg-tile__head">
        <h3 className="pg-tile__title">{title}</h3>
        <a
          className="pg-tile__link nui-focusable"
          href={href(to)}
          aria-label={`Abrir documentação: ${title}`}
        >
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </header>
      <div className="pg-tile__body">{children}</div>
    </section>
  );
}

export function InstallChip() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="pg-install">
      <code className="pg-install__cmd">
        <span aria-hidden="true">$ </span>
        {INSTALL}
      </code>
      <button
        type="button"
        className="pg-install__copy nui-focusable"
        aria-label="Copiar comando de instalação"
        onClick={async () => {
          if (await copyText(INSTALL)) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }
        }}
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span className="nui-visually-hidden" role="status">
          {copied ? 'Comando copiado' : ''}
        </span>
      </button>
    </div>
  );
}

export function HeroDemo() {
  const { toast } = useToast();
  return (
    <Card title="Convidar para a equipe" headingLevel={2} className="pg-hero__card">
      <form
        className="pg-stack pg-stack--wide"
        onSubmit={(event) => {
          event.preventDefault();
          toast({
            title: 'Convite enviado',
            description: 'Beatriz recebeu o e-mail.',
            tone: 'success',
          });
        }}
      >
        <TextField label="E-mail" type="email" defaultValue="beatriz@lumen.com.br" />
        <Select
          label="Papel"
          defaultValue="fin"
          options={[
            { value: 'adm', label: 'Administradora' },
            { value: 'fin', label: 'Financeiro' },
            { value: 'lei', label: 'Somente leitura' },
          ]}
        />
        <Switch label="Avisar por e-mail" defaultChecked />
        <div className="pg-row">
          <Button type="submit">Enviar convite</Button>
          <AvatarGroup
            label="Já na equipe"
            size="sm"
            people={['Marina Duarte', 'Caio Fernandes', 'Sofia Tavares'].map((name) => ({ name }))}
          />
        </div>
      </form>
    </Card>
  );
}

export function ToastTile() {
  const { toast } = useToast();
  return (
    <div className="pg-row">
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            title: 'Convite enviado',
            description: 'Marina recebeu o e-mail.',
            tone: 'success',
          })
        }
      >
        Disparar toast
      </Button>
      <Menu
        label="Ações"
        size="sm"
        items={[
          { id: 'a', label: 'Duplicar' },
          { id: 'b', label: 'Arquivar', disabled: true },
          { id: 'c', label: 'Excluir', tone: 'danger', separatorBefore: true },
        ]}
      />
    </div>
  );
}
