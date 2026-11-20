import { Avatar, AvatarGroup } from '../../../../src';
import { generateJsx } from '../../lib/codegen';
import { type ComponentDoc, type Control } from '../types';
import { bool, str } from '../shared';

const PEOPLE = [
  'Marina Duarte',
  'Caio Fernandes',
  'Beatriz Nogueira',
  'Renan Albuquerque',
  'Sofia Tavares',
  'Otávio Lins',
].map((name) => ({ name }));

const avatarControls: Control[] = [
  { name: 'name', kind: 'text', default: 'Marina Duarte' },
  { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
  { name: 'group', kind: 'boolean', default: false },
  { name: 'max', kind: 'select', options: ['2', '3', '4'], default: '3' },
];

export const doc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  group: 'Conteúdo e feedback',
  summary:
    'Foto ou iniciais coloridas de uma pessoa, com grupo sobreposto e contador. A cor é estável por nome.',
  semantics: 'Container com role="img" e aria-label com o nome; a imagem interna é decorativa.',
  keyboard: [{ keys: '—', action: 'Não interativo: não entra na ordem de tabulação.' }],
  aria: [
    'O nome da pessoa vira o rótulo do avatar; as iniciais são aria-hidden para não serem lidas duas vezes.',
    'Se a foto falhar ao carregar, as iniciais aparecem no lugar.',
    'AvatarGroup anuncia o conjunto como role="group" com um rótulo e o contador como "mais N".',
    'As cores usam pares do próprio tema com contraste AA; o nome é o sinal, não a cor.',
  ],
  props: [
    {
      name: 'name',
      type: 'string',
      description: 'Nome completo (obrigatório). Gera iniciais, cor e nome acessível.',
    },
    { name: 'src', type: 'string', description: 'URL da foto. Opcional.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", description: 'Tamanho. Padrão: md.' },
    {
      name: 'AvatarGroup.max',
      type: 'number',
      description: 'Quantos avatares aparecem antes do "+N". Padrão: 4.',
    },
  ],
  demos: [
    {
      title: 'Tamanhos e cores',
      preview: (
        <div className="pg-row">
          {PEOPLE.map((person) => (
            <Avatar key={person.name} name={person.name} />
          ))}
          <Avatar name="Marina Duarte" size="sm" />
          <Avatar name="Marina Duarte" size="lg" />
        </div>
      ),
      code: `<Avatar name="Marina Duarte" />
<Avatar name="Caio Fernandes" size="sm" />
<Avatar name="Beatriz Nogueira" size="lg" />`,
    },
    {
      title: 'Grupo com contador',
      preview: <AvatarGroup label="Responsáveis pelo projeto" people={PEOPLE} max={4} />,
      code: `<AvatarGroup label="Responsáveis pelo projeto" people={people} max={4} />`,
      setup: `const people = [
  { name: 'Marina Duarte' },
  { name: 'Caio Fernandes' },
  { name: 'Beatriz Nogueira' },
  { name: 'Renan Albuquerque' },
  { name: 'Sofia Tavares' },
  { name: 'Otávio Lins' },
];`,
    },
  ],
  playground: {
    controls: avatarControls,
    render: (v) =>
      bool(v, 'group') ? (
        <AvatarGroup
          label="Equipe do projeto"
          people={PEOPLE}
          max={Number(v.max)}
          size={v.size as 'sm' | 'md' | 'lg'}
        />
      ) : (
        <Avatar name={str(v, 'name') || 'Sem nome'} size={v.size as 'sm' | 'md' | 'lg'} />
      ),
    setup: (v) =>
      bool(v, 'group')
        ? 'const people = [\n' +
          PEOPLE.map((person) => "  { name: '" + person.name + "' },").join('\n') +
          '\n];'
        : '',
    code: (v) =>
      bool(v, 'group')
        ? '<AvatarGroup label="Equipe do projeto" people={people} max={' +
          String(v.max) +
          '}' +
          (v.size !== 'md' ? ' size="' + String(v.size) + '"' : '') +
          ' />'
        : generateJsx('Avatar', avatarControls, v, {
            always: ['name'],
            skip: ['group', 'max'],
          }),
  },
  anatomy: [
    {
      label: 'Container',
      description: 'Moldura com raio pequeno, borda de 1 px e role="img".',
      selector: '.nui-avatar',
    },
    {
      label: 'Iniciais',
      description: 'Primeira e última palavra do nome, em Space Grotesk.',
      selector: '.nui-avatar__initials',
    },
  ],
  dos: [
    {
      text: 'Passe o nome completo: ele gera o rótulo acessível e a cor.',
      code: '<Avatar name="Marina Duarte" />',
    },
    {
      text: 'Use AvatarGroup com um rótulo que diga quem são.',
      code: '<AvatarGroup label="Revisores" people={…} />',
    },
  ],
  donts: [
    {
      text: 'Não use o avatar como único jeito de identificar quem fez algo: escreva o nome ao lado.',
    },
    { text: 'Não passe só o primeiro nome quando houver homônimos na lista.' },
  ],
};
