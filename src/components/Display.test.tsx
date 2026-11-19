import { render, screen } from '@testing-library/react';
import { axeViolations } from '../test/axe';
import { Badge } from './Badge/Badge';
import { Button } from './Button/Button';
import { Card } from './Card/Card';
import { EmptyState } from './EmptyState/EmptyState';
import { Skeleton } from './Skeleton/Skeleton';

describe('Badge', () => {
  it('renders its text and defaults to the neutral tone', () => {
    render(<Badge>Rascunho</Badge>);
    expect(screen.getByText('Rascunho')).toHaveAttribute('data-tone', 'neutral');
  });

  it('applies the requested tone and forwards props', () => {
    render(
      <Badge tone="danger" className="extra" data-testid="b">
        Falhou
      </Badge>,
    );
    expect(screen.getByTestId('b')).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByTestId('b')).toHaveClass('nui-badge', 'extra');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Badge tone="success">Ativo</Badge>);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Card', () => {
  it('is a section labelled by its title with the configured heading level', () => {
    render(<Card title="Plano" headingLevel={2} />);
    expect(screen.getByRole('region', { name: 'Plano' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).toBeInTheDocument();
  });

  it('defaults to an h3 and renders description, body and footer', () => {
    render(
      <Card title="Plano" description="Cobrança mensal" footer={<Button>Assinar</Button>}>
        Corpo
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Cobrança mensal')).toBeInTheDocument();
    expect(screen.getByText('Corpo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Assinar' })).toBeInTheDocument();
  });

  it('is not a landmark and has no heading without a title', () => {
    render(<Card>Só conteúdo</Card>);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Card title="Plano" description="Mensal">
        Corpo
      </Card>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the requested number of text lines with a shorter last line', () => {
    const { container } = render(<Skeleton lines={3} />);
    const bars = container.querySelectorAll('.nui-skeleton');
    expect(bars).toHaveLength(3);
    expect((bars[2] as HTMLElement).style.width).toBe('60%');
  });

  it('renders a single bar for non-text shapes and applies size', () => {
    const { container } = render(<Skeleton shape="circle" lines={4} width={40} height={40} />);
    const bars = container.querySelectorAll('.nui-skeleton');
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveAttribute('data-shape', 'circle');
    expect((bars[0] as HTMLElement).style.width).toBe('40px');
  });

  it('has no axe violations inside a busy container', async () => {
    const { container } = render(
      <div aria-busy="true">
        <Skeleton lines={2} />
      </div>,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState
        title="Nenhum projeto"
        description="Crie o primeiro."
        action={<Button>Criar</Button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Nenhum projeto' })).toBeInTheDocument();
    expect(screen.getByText('Crie o primeiro.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });

  it('hides the icon from assistive technology and honors headingLevel', () => {
    render(<EmptyState title="Vazio" icon={<span data-testid="i">★</span>} headingLevel={3} />);
    expect(screen.getByTestId('i').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <EmptyState
        title="Nenhum projeto"
        description="Crie o primeiro."
        action={<Button>Criar</Button>}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
