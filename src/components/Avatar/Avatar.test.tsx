import { fireEvent, render, screen } from '@testing-library/react';
import { axeViolations } from '../../test/axe';
import { Avatar, AvatarGroup, getInitials, getToneIndex } from './Avatar';

describe('getInitials', () => {
  it('uses the first and last words', () => {
    expect(getInitials('Maria da Silva Souza')).toBe('MS');
    expect(getInitials('  ana  ')).toBe('A');
    expect(getInitials('')).toBe('?');
  });
});

describe('getToneIndex', () => {
  it('is stable and within range', () => {
    expect(getToneIndex('Ana Lima')).toBe(getToneIndex('Ana Lima'));
    expect(getToneIndex('Ana Lima')).toBeGreaterThanOrEqual(0);
    expect(getToneIndex('Ana Lima')).toBeLessThan(5);
  });
});

describe('Avatar', () => {
  it('exposes the name as an image label and shows initials', () => {
    render(<Avatar name="Ana Lima" />);
    const avatar = screen.getByRole('img', { name: 'Ana Lima' });
    expect(avatar).toHaveTextContent('AL');
  });

  it('renders the photo and falls back to initials when it fails', () => {
    const { container } = render(<Avatar name="Ana Lima" src="/x.png" />);
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    fireEvent.error(image as HTMLImageElement);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ana Lima' })).toHaveTextContent('AL');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Avatar name="Ana Lima" />);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('AvatarGroup', () => {
  const people = ['Ana Lima', 'Bruno Reis', 'Carla Dias', 'Davi Nunes', 'Eva Rocha'].map(
    (name) => ({
      name,
    }),
  );

  it('limits visible avatars and announces the rest', () => {
    render(<AvatarGroup label="Responsáveis" people={people} max={3} />);
    const group = screen.getByRole('group', { name: 'Responsáveis' });
    expect(group.querySelectorAll('[role="img"]')).toHaveLength(4);
    expect(screen.getByRole('img', { name: 'mais 2' })).toHaveTextContent('+2');
  });

  it('has no axe violations', async () => {
    const { container } = render(<AvatarGroup label="Responsáveis" people={people} max={2} />);
    expect(await axeViolations(container)).toEqual([]);
  });
});
