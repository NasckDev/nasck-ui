import { addons } from 'storybook/manager-api';
import { nasckTheme } from './nasck-theme';

addons.setConfig({ theme: nasckTheme() });
