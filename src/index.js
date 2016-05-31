import Menu from './Menu';
import MenuContext from './MenuContext';
import MenuOption from './MenuOption';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';

import ContextMenu from './renderers/ContextMenu';
import SlideInMenu from './renderers/SlideInMenu';
const renderers = { ContextMenu, SlideInMenu };

export { Menu as default, MenuContext, MenuOption, MenuOptions, MenuTrigger, renderers };
