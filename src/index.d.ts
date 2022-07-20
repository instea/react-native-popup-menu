/**
 * TypeScript declaration for https://github.com/instea/react-native-popup-menu
 *
 * @author Wang Guan <momocraft@gmail>
 */
declare module "react-native-popup-menu" {
  import * as React from "react";
  import { StyleProp, ViewStyle, TextStyle } from "react-native";

  /**
   * MenuProvider
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menuprovider
   */

  interface MenuProviderProps {
    style?: StyleProp<ViewStyle>;
    customStyles?: {
      menuProviderWrapper?: StyleProp<ViewStyle>;
      backdrop?: StyleProp<ViewStyle>;
    };
    backHandler?: boolean | Function;
    skipInstanceCheck?: boolean;
    children: React.ReactNode;
  }

  interface MenuProviderStatic extends React.ComponentClass<MenuProviderProps> {
    // FIXME: these methods does not get included in ref, unlike WebView in react-native.d.ts
    open(name: string): Promise<void>;

    toggleMenu(name: string): Promise<void>;

    close(): Promise<void>;
  }

  export const MenuProvider: MenuProviderStatic;

  /**
   * Menu
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menu
   */
  interface MenuProps {
    name?: string;
    opened?: boolean;
    renderer?: Function;
    rendererProps?: any;
    style?: StyleProp<ViewStyle>;

    onSelect?(optionValue: any): any;

    onOpen?(): void;

    onClose?(): void;

    onBackdropPress?(): void;
    children?: React.ReactNode;
  }

  export class Menu extends React.Component<MenuProps> {
    static debug: boolean;
    static setDefaultRenderer(renderer: Function): void;
    static setDefaultRendererProps(defaultRendererProps: any): void;

    /** Closes currently opened menu. */
    close(): Promise<void>;

    /** Returns `true` if this menu is open. */
    isOpen(): boolean;

    /** Opens this menu. */
    open(): Promise<void>;
  }

  /**
   * MenuTrigger
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menutrigger
   */
  interface MenuTriggerProps {
    disabled?: boolean;
    text?: string;
    customStyles?: {
      triggerOuterWrapper?: StyleProp<ViewStyle>;
      triggerWrapper?: StyleProp<ViewStyle>;
      triggerText?: StyleProp<TextStyle>;
      TriggerTouchableComponent?: Function;
      triggerTouchable?: {};
    };
    testID?: string;
    triggerOnLongPress?: boolean;

    onPress?(): void;
    onAlternativeAction? (): void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  }

  export const MenuTrigger: React.ComponentClass<MenuTriggerProps>;

  /**
   * MenuOptions
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menuoptions
   */
  interface MenuOptionsProps {
    optionsContainerStyle?: StyleProp<ViewStyle>;
    renderOptionsContainer?: Function;
    customStyles?: MenuOptionsCustomStyle;
    testID?: string;
    children?: React.ReactNode;
  }

  interface MenuOptionsCustomStyle extends MenuOptionCustomStyle {
    optionsWrapper?: StyleProp<ViewStyle>;
    optionsContainer?: StyleProp<ViewStyle>;
  }

  export const MenuOptions: React.ComponentClass<MenuOptionsProps>;

  /**
   * MenuOption
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menuoption
   */
  interface MenuOptionProps {
    value?: any;
    text?: string;
    disabled?: boolean;
    disableTouchable?: boolean;
    customStyles?: MenuOptionCustomStyle;

    style?: StyleProp<ViewStyle>;

    onSelect?(): any;
    children?: React.ReactNode;
  }

  interface MenuOptionCustomStyle {
    optionWrapper?: StyleProp<ViewStyle>;
    optionText?: StyleProp<TextStyle>;
    optionTouchable?: {};
    OptionTouchableComponent?: Function;
  }

  export const MenuOption: React.ComponentClass<MenuOptionProps>;

  /**
   * Menu renderers
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#renderers
   */
  export const renderers: Readonly<{
    ContextMenu: Function;
    NotAnimatedContextMenu: Function;
    SlideInMenu: Function;
    Popover: Function;
  }>;

  /**
   * Types for MenuRegistry (which isn't exported)
   */
  interface TriggerLayoutType {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

  interface OptionsLayoutType {
    width?: number;
    height?: number;
  }

  interface MenuEntry {
    name: string;
    instance: Menu;
    triggerLayout?: TriggerLayoutType;
    optionsLayout?: OptionsLayoutType;
    optionsCustomStyles?: MenuOptionsCustomStyle;
  }

  interface MenuRegistry {
    subscribe: (instance: Menu) => void;
    unsubscribe: (instance: Menu) => void;
    updateLayoutInfo: (
      name: string,
      layouts?: {
        triggerLayout?: TriggerLayoutType;
        optionsLayout?: OptionsLayoutType;
      }
    ) => void;
    setOptionsCustomStyles: (name: string, optionsCustomStyles: MenuOptionsCustomStyle) => void;
    getMenu: (name: string) => MenuEntry;
    getAll: () => MenuEntry[];
  }

  /**
   * withMenuContext
   * @see https://github.com/instea/react-native-popup-menu/blob/master/doc/api.md#menuprovider
   */
  interface MenuActions {
    openMenu: (name: string) => Promise<void>;
    closeMenu: () => Promise<void>;
    toggleMenu: (name: string) => Promise<void>;
    isMenuOpen: () => boolean;
  }
  
  export interface MenuContext {
    // This part shouldn't be exported to the user so it's commented out
    // menuRegistry: MenuRegistry;
    menuActions: MenuActions;
  }

  interface MenuContextProps {
    ctx: MenuContext;
  }

  export function withMenuContext<PropType extends MenuContextProps>(
    component: React.ComponentType<PropType>
  ): React.ComponentType<Omit<PropType, "ctx">>;
}
