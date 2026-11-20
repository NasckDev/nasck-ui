import { Quote, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button, Checkbox, TextField, useToast } from '../../../../src';
import { LogoMark } from '../../components/Logo';
import '../../styles/templates-login.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const FAKE_LATENCY_MS = 1200;

interface Errors {
  email?: string;
  password?: string;
}

export function LoginTemplate() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = {
      email: EMAIL_PATTERN.test(email)
        ? undefined
        : 'Informe um e-mail válido, como nome@empresa.com.br.',
      password:
        password.length >= MIN_PASSWORD
          ? undefined
          : `A senha tem pelo menos ${MIN_PASSWORD} caracteres.`,
    };
    setErrors(found);
    if (found.email || found.password) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Bem-vinda de volta',
        description: 'Login simulado: nada foi enviado a servidor algum.',
        tone: 'success',
      });
    }, FAKE_LATENCY_MS);
  };

  return (
    <div className="tpl tpl-login">
      <div className="tpl-login__brand">
        <div className="tpl-login__grid" aria-hidden="true" />
        <div className="tpl-brand">
          <LogoMark size={28} /> <strong>Fluxo</strong>
        </div>
        <figure className="tpl-login__quote">
          <Quote size={22} aria-hidden="true" />
          <blockquote>Fechamos o mês em dois dias, e não mais em duas semanas.</blockquote>
          <figcaption>Marina Duarte, financeiro na Lumen Estúdio</figcaption>
        </figure>
      </div>
      <div className="tpl-login__panel">
        <form className="tpl-login__form" onSubmit={handleSubmit} noValidate>
          <h2 className="tpl-h">Entrar na sua conta</h2>
          <p className="tpl-sub">Use o e-mail de trabalho cadastrado.</p>
          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            required
          />
          <TextField
            label="Senha"
            type={reveal ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
            description={`Mínimo de ${MIN_PASSWORD} caracteres.`}
            required
          />
          <div className="tpl-login__row">
            <Checkbox
              label="Mostrar senha"
              checked={reveal}
              onChange={(event) => setReveal(event.target.checked)}
            />
            <a
              href="#/modelos/login"
              onClick={(event) => {
                event.preventDefault();
                toast({
                  title: 'Link de recuperação enviado',
                  description: 'Verifique sua caixa de entrada.',
                  tone: 'neutral',
                });
              }}
            >
              Esqueci a senha
            </a>
          </div>
          <Button type="submit" size="lg" loading={loading} loadingLabel="Entrando">
            Entrar
          </Button>
          <div className="tpl-login__divider" role="separator" aria-label="ou">
            <span>ou</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            startIcon={<ShieldCheck size={18} aria-hidden="true" />}
            onClick={() => toast({ title: 'SSO indisponível na demonstração', tone: 'warning' })}
          >
            Entrar com SSO
          </Button>
          <p className="tpl-sub tpl-login__legal">
            Ao entrar, você concorda com os termos de uso e a política de privacidade.
          </p>
        </form>
      </div>
    </div>
  );
}
