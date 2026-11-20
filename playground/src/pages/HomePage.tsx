import { ArrowRight, Palette } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Combobox,
  Pagination,
  Switch,
  Table,
  Tabs,
  TextField,
} from '../../../src';

import { Github } from '../components/GithubIcon';
import { docMetas } from '../docs';
import { COMPONENT_PREFIX, TEMPLATES, TEMPLATE_PREFIX, iconFor } from '../nav';
import { href } from '../router';
import '../styles/hero.css';
import '../styles/home.css';

import { GettingStarted } from './home/GettingStarted';
import { HeroDemo, InstallChip, Tile, ToastTile } from './home/HomeParts';
import { CITIES, DEALS, PEOPLE, PILLARS, dealColumns } from './home/homeData';

export function HomePage() {
  const [page, setPage] = useState(3);
  return (
    <>
      <header className="pg-hero">
        <div className="pg-hero__grid" aria-hidden="true" />
        <div className="pg-hero__copy">
          <p className="pg-hero__badge">
            <span className="pg-hero__dot" aria-hidden="true" /> Design system para React · WCAG 2.2
            AA
          </p>
          <h1 className="pg-hero__title" id="page-title" tabIndex={-1}>
            Interfaces que todo mundo consegue usar,{' '}
            <span className="pg-hero__mark">prontas para vender.</span>
          </h1>
          <p className="pg-hero__lead">
            {docMetas.length} componentes acessíveis, tokens exportáveis, tema claro e escuro e três
            telas completas montadas só com a biblioteca. Tudo documentado, testado no teclado e
            verificado com axe.
          </p>
          <div className="pg-hero__actions">
            <a
              className="pg-cta pg-cta--primary nui-focusable"
              href={href(`${COMPONENT_PREFIX}button`)}
            >
              Começar pelos componentes <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="pg-cta nui-focusable" href={href('/tokens')}>
              <Palette size={18} aria-hidden="true" /> Construir um tema
            </a>
            <a
              className="pg-cta pg-cta--quiet nui-focusable"
              href="https://github.com/NasckDev/nasck-ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} /> GitHub
              <span className="nui-visually-hidden"> (abre em nova aba)</span>
            </a>
          </div>
          <InstallChip />
        </div>
        <div className="pg-hero__demo">
          <HeroDemo />
        </div>
      </header>

      <GettingStarted />

      <section aria-labelledby="sec-vitrine" className="pg-section">
        <p className="pg-eyebrow">Vitrine ao vivo</p>
        <h2 id="sec-vitrine" className="pg-h2">
          Tudo aqui é a biblioteca de verdade
        </h2>
        <p className="pg-note">Clique, digite e navegue pelo teclado: nada é imagem.</p>
        <div className="pg-bento">
          <Tile title="Button" to={`${COMPONENT_PREFIX}button`} className="pg-tile--a">
            <div className="pg-row">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Fantasma</Button>
              <Button variant="danger">Perigo</Button>
              <Button loading>Enviando</Button>
            </div>
          </Tile>
          <Tile title="Formulário" to={`${COMPONENT_PREFIX}text-field`} className="pg-tile--b">
            <div className="pg-stack">
              <TextField
                label="E-mail"
                type="email"
                placeholder="voce@empresa.com.br"
                description="Nunca compartilhamos."
              />
              <Switch label="Notificações" defaultChecked />
              <Checkbox label="Aceito os termos de uso" />
            </div>
          </Tile>
          <Tile title="Combobox" to={`${COMPONENT_PREFIX}combobox`} className="pg-tile--c">
            <Combobox label="Cidade" options={CITIES} placeholder="Digite “sao”…" />
          </Tile>
          <Tile title="Table" to={`${COMPONENT_PREFIX}table`} className="pg-tile--d">
            <Table
              caption="Negócios em aberto"
              columns={dealColumns}
              rows={DEALS}
              getRowId={(row) => row.id}
              defaultSort={{ columnId: 'value', direction: 'descending' }}
            />
          </Tile>
          <Tile title="Tabs" to={`${COMPONENT_PREFIX}tabs`} className="pg-tile--e">
            <Tabs
              label="Período"
              items={[
                { id: 'd', label: 'Dia', content: 'R$ 1.280 em vendas hoje.' },
                { id: 's', label: 'Semana', content: 'R$ 9.450 nos últimos 7 dias.' },
                { id: 'm', label: 'Mês', content: 'R$ 38.900 em novembro.' },
              ]}
            />
          </Tile>
          <Tile title="Avatar e Badge" to={`${COMPONENT_PREFIX}avatar`} className="pg-tile--f">
            <div className="pg-stack">
              <AvatarGroup label="Equipe do projeto" people={PEOPLE} max={4} />
              <div className="pg-row">
                <Badge tone="success">Ativo</Badge>
                <Badge tone="warning">Em revisão</Badge>
                <Badge tone="danger">Atrasado</Badge>
                <Badge tone="accent">Novo</Badge>
              </div>
            </div>
          </Tile>
          <Tile title="Toast e Menu" to={`${COMPONENT_PREFIX}menu`} className="pg-tile--g">
            <ToastTile />
          </Tile>
          <Tile title="Accordion" to={`${COMPONENT_PREFIX}accordion`} className="pg-tile--h">
            <Accordion
              defaultValue={['a']}
              items={[
                { id: 'a', title: 'Posso testar antes?', content: 'Sim, 14 dias sem cartão.' },
                { id: 'b', title: 'Como cancelo?', content: 'Em Configurações, Cobrança.' },
              ]}
            />
          </Tile>
          <Tile title="Pagination" to={`${COMPONENT_PREFIX}pagination`} className="pg-tile--i">
            <Pagination page={page} pageCount={18} onPageChange={setPage} />
          </Tile>
        </div>
      </section>

      <section aria-labelledby="sec-pilares" className="pg-section">
        <h2 id="sec-pilares" className="pg-h2">
          Por que Nasck UI
        </h2>
        <ul className="pg-pillars">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="pg-pillar">
              <Icon size={22} aria-hidden="true" />
              <h3 className="pg-pillar__title">{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-modelos" className="pg-section">
        <h2 id="sec-modelos" className="pg-h2">
          Modelos prontos
        </h2>
        <p className="pg-note">
          Telas completas montadas só com a biblioteca. Veja como os componentes se combinam.
        </p>
        <ul className="pg-cards">
          {TEMPLATES.map((template) => (
            <li key={template.slug}>
              <a
                className="pg-card-link nui-focusable"
                href={href(`${TEMPLATE_PREFIX}${template.slug}`)}
              >
                <template.icon size={22} aria-hidden="true" />
                <span className="pg-card-link__name">{template.label}</span>
                <span className="pg-card-link__text">{template.summary}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-componentes" className="pg-section">
        <h2 id="sec-componentes" className="pg-h2">
          {docMetas.length} componentes
        </h2>
        <ul className="pg-index">
          {docMetas.map((doc) => {
            const Icon = iconFor(doc.slug);
            return (
              <li key={doc.slug}>
                <a
                  className="pg-index__link nui-focusable"
                  href={href(`${COMPONENT_PREFIX}${doc.slug}`)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{doc.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
