import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.css';

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface CardProps extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  title?: ReactNode;
  /** Heading level of the title, so the card fits the page outline. Defaults to 3. */
  headingLevel?: HeadingLevel;
  description?: ReactNode;
  footer?: ReactNode;
}

/** Content container. With a title it becomes a labelled `section` landmark-like region. */
export function Card({
  title,
  headingLevel = 3,
  description,
  footer,
  className,
  children,
  ...rest
}: CardProps) {
  const titleId = useId();
  const Heading = `h${headingLevel}` as const;

  return (
    <section
      {...rest}
      aria-labelledby={title ? titleId : undefined}
      className={cx('nui-card', className)}
    >
      {title ? (
        <Heading id={titleId} className="nui-card__title">
          {title}
        </Heading>
      ) : null}
      {description ? <p className="nui-card__description">{description}</p> : null}
      {children ? <div className="nui-card__body">{children}</div> : null}
      {footer ? <div className="nui-card__footer">{footer}</div> : null}
    </section>
  );
}
