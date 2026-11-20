import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppAlert } from '../ui/AppAlert.tsx';
import { AppButton } from '../ui/AppButton.tsx';
import { AppCard } from '../ui/AppCard.tsx';
import { AppCheckbox } from '../ui/AppCheckbox.tsx';
import { AppInput } from '../ui/AppInput.tsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ forcarErro = false }: { forcarErro?: boolean }) {
  const [email, setEmail] = useState(forcarErro ? 'marina@' : '');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [tentou, setTentou] = useState(forcarErro);

  const erroEmail =
    tentou && !EMAIL_PATTERN.test(email)
      ? 'Informe um e-mail completo, como nome@empresa.com.br.'
      : undefined;
  const erroSenha = tentou && senha.length < 8 ? 'A senha tem pelo menos 8 caracteres.' : undefined;

  const entrar = (): void => {
    setTentou(true);
    if (!EMAIL_PATTERN.test(email) || senha.length < 8) return;
    setEnviando(true);
    setTimeout(() => setEnviando(false), 1200);
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <AppCard>
          <h1 style={{ marginTop: 0, fontSize: 24 }}>Entrar na conta</h1>
          <p>Use o e-mail do seu cadastro para acessar o painel.</p>
          <div style={{ display: 'grid', gap: 16 }}>
            {forcarErro ? (
              <AppAlert
                type="error"
                title="Não foi possível entrar"
                description="Confira o e-mail e a senha e tente de novo."
              />
            ) : null}
            <AppInput
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              prefixIcon="mail"
              placeholder="voce@empresa.com.br"
              errorMessage={erroEmail}
              required
            />
            <AppInput
              label="Senha"
              type="password"
              value={senha}
              onChange={setSenha}
              errorMessage={erroSenha}
              required
            />
            <AppCheckbox label="Manter conectado neste aparelho" />
            <AppButton variant="primary" size="large" block loading={enviando} onClick={entrar}>
              Entrar
            </AppButton>
            <AppButton variant="link">Esqueci minha senha</AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  );
}

const meta = {
  title: 'Modelos/Login',
  component: Login,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Login>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
};
export const Erro: Story = { args: { forcarErro: true } };
