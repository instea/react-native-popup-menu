/**
 * TypeScript declaration for https://github.com/instea/react-native-popup-menu
 *
 * @author Wang Guan <momocraft@gmail>
 */
declare module "react-native-popup-menu" {
  import * as React from "react";
  import { StyleProp, ViewStyle } from "react-native";

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

    onSelect?(optionValue: any): any;

    onOpen?(): void;

    onClose?(): void;

    onBackdropPress?(): void;
  }

  interface MenuStatic {
    debug: boolean;

    setDefaultRenderer(renderer: Function): void;

    setDefaultRendererProps(defaultRendererProps: any): void;
  }

  export const Menu: React.ComponentClass<MenuProps> & MenuStatic;

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
      triggerText?: StyleProp<ViewStyle>;
      TriggerTouchableComponent?: Function;
      triggerTouchable?: {};
    };

    onPress?(): void;
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
  }

  interface MenuOptionCustomStyle {
    optionWrapper?: StyleProp<ViewStyle>;
    optionText?: StyleProp<ViewStyle>;
    optionTouchable?: {};
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
}
