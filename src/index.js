// platform select polyfil for older RN versions
import { Platform } from 'react-native';
if (!Platform.select) {
  Platform.select = (obj) => obj[Platform.OS];
}

import Menu from './Menu';
import MenuContext from './MenuContext';
import MenuOption from './MenuOption';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';

import ContextMenu from './renderers/ContextMenu';
import NotAnimatedContextMenu from './renderers/NotAnimatedContextMenu';
import SlideInMenu from './renderers/SlideInMenu';
const renderers = { ContextMenu, SlideInMenu, NotAnimatedContextMenu };

export { Menu as default, Menu, MenuContext, MenuOption, MenuOptions, MenuTrigger, renderers };
