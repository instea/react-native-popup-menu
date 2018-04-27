import './polyfills';
import { deprecatedComponent } from './helpers'

import Menu from './Menu';
import MenuProvider, { withCtx } from './MenuProvider';
import MenuOption from './MenuOption';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';

import ContextMenu from './renderers/ContextMenu';
import NotAnimatedContextMenu from './renderers/NotAnimatedContextMenu';
import SlideInMenu from './renderers/SlideInMenu';
import Popover from './renderers/Popover';
const renderers = { ContextMenu, SlideInMenu, NotAnimatedContextMenu, Popover };

const MenuContext = deprecatedComponent(
  'MenuContext is deprecated and it might be removed in future releases, use MenuProvider instead.',
  ['openMenu', 'toggleMenu', 'closeMenu', 'isMenuOpen'],
)(MenuProvider);

export {
  Menu as default,
  Menu,
  MenuProvider,
  MenuContext,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
  withCtx as withMenuContext,
};
