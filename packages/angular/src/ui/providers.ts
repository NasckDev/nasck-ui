import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {
  LOCALE_ID,
  type EnvironmentProviders,
  type Provider,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  ArrowDownOutline,
  ArrowUpOutline,
  BellOutline,
  CalendarOutline,
  CheckOutline,
  CloseOutline,
  DeleteOutline,
  DownOutline,
  DownloadOutline,
  EditOutline,
  EyeOutline,
  FilterOutline,
  HomeOutline,
  InfoCircleOutline,
  MailOutline,
  MoreOutline,
  PlusOutline,
  ReloadOutline,
  SearchOutline,
  SettingOutline,
  UploadOutline,
  UserOutline,
  WarningOutline,
  EyeInvisibleOutline,
} from '@ant-design/icons-angular/icons';
import { ptBR } from 'date-fns/locale';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { pt_BR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';

registerLocaleData(localePt);

/**
 * Provedores que todo app Angular precisa para usar os wrappers: icones usados pelo contrato,
 * idioma pt-BR do NG-ZORRO e do Angular.
 */
export function provideNasckUi(): EnvironmentProviders {
  const extra: Provider[] = [{ provide: LOCALE_ID, useValue: 'pt-BR' }];
  return makeEnvironmentProviders([
    ...extra,
    provideNzI18n(pt_BR),
    provideNzDateFnsAdapter({ locale: ptBR, firstDayOfWeek: 0 }),
    provideNzIcons([
      ArrowDownOutline,
      ArrowUpOutline,
      BellOutline,
      CalendarOutline,
      CheckOutline,
      CloseOutline,
      DeleteOutline,
      DownOutline,
      DownloadOutline,
      EditOutline,
      EyeOutline,
      EyeInvisibleOutline,
      FilterOutline,
      HomeOutline,
      InfoCircleOutline,
      MailOutline,
      MoreOutline,
      PlusOutline,
      ReloadOutline,
      SearchOutline,
      SettingOutline,
      UploadOutline,
      UserOutline,
      WarningOutline,
    ]),
  ]);
}
