import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { theme } from 'antd';
import type { ControlSize, IconName } from '@nasckdev/nasck-ui-tokens';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

const ICONS: Record<IconName, ReactElement> = {
  plus: <PlusOutlined />,
  search: <SearchOutlined />,
  delete: <DeleteOutlined />,
  edit: <EditOutlined />,
  download: <DownloadOutlined />,
  upload: <UploadOutlined />,
  check: <CheckOutlined />,
  close: <CloseOutlined />,
  user: <UserOutlined />,
  setting: <SettingOutlined />,
  bell: <BellOutlined />,
  info: <InfoCircleOutlined />,
  warning: <WarningOutlined />,
  mail: <MailOutlined />,
  calendar: <CalendarOutlined />,
  filter: <FilterOutlined />,
  reload: <ReloadOutlined />,
  more: <MoreOutlined />,
  'arrow-up': <ArrowUpOutlined />,
  'arrow-down': <ArrowDownOutlined />,
  home: <HomeOutlined />,
  eye: <EyeOutlined />,
};

export function renderIcon(name: IconName | undefined): ReactElement | undefined {
  return name ? ICONS[name] : undefined;
}

type AntSize = 'small' | 'middle' | 'large';

export function toAntSize(size: ControlSize | undefined): AntSize {
  if (size === 'small') return 'small';
  if (size === 'large') return 'large';
  return 'middle';
}

/** Texto so para leitor de tela. */
export const visuallyHidden: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export interface FieldProps {
  id: string;
  label?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  children: ReactNode;
}

/** Rotulo, ajuda e mensagem de erro de um campo. O controle recebe `fieldDescribedBy`. */
export function Field({
  id,
  label,
  hint,
  errorMessage,
  required,
  children,
}: FieldProps): ReactElement {
  const { token } = theme.useToken();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: token.marginXXS }}>
      {label ? (
        <label htmlFor={id} style={{ fontWeight: 500, color: token.colorText }}>
          {label}
          {required ? (
            <span aria-hidden="true" style={{ color: token.colorError }}>
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {errorMessage ? (
        <div
          id={`${id}-message`}
          role="alert"
          style={{ color: token.colorError, fontSize: token.fontSizeSM }}
        >
          {errorMessage}
        </div>
      ) : hint ? (
        <div
          id={`${id}-message`}
          style={{ color: token.colorTextDescription, fontSize: token.fontSizeSM }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, errorMessage?: string): string | undefined {
  return errorMessage || hint ? `${id}-message` : undefined;
}
