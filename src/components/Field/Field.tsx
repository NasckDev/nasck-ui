import { useId, type ReactNode } from 'react';

export interface FieldIds {
  controlId: string;
  descriptionId: string | undefined;
  errorId: string | undefined;
  /** Value for `aria-describedby`: description first, then error. */
  describedBy: string | undefined;
}

interface UseFieldIdsOptions {
  id: string | undefined;
  hasDescription: boolean;
  hasError: boolean;
}

/** Generates stable ids that wire a control to its label, description and error message. */
export const useFieldIds = ({ id, hasDescription, hasError }: UseFieldIdsOptions): FieldIds => {
  const generated = useId();
  const controlId = id ?? `nui-${generated}`;
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;
  const errorId = hasError ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  return { controlId, descriptionId, errorId, describedBy };
};

interface FieldMessagesProps {
  ids: FieldIds;
  description: ReactNode | undefined;
  error: ReactNode | undefined;
}

/** Renders the helper text and the error message referenced by `aria-describedby`. */
export function FieldMessages({ ids, description, error }: FieldMessagesProps) {
  return (
    <>
      {description ? (
        <p id={ids.descriptionId} className="nui-field__description">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={ids.errorId} className="nui-field__error">
          {error}
        </p>
      ) : null}
    </>
  );
}

interface FieldLabelProps {
  htmlFor: string;
  required: boolean | undefined;
  children: ReactNode;
}

/** Visible label; the required marker is decorative because `required` is announced natively. */
export function FieldLabel({ htmlFor, required, children }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="nui-field__label">
      {children}
      {required ? (
        <span className="nui-field__required" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
