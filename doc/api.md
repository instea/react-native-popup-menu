# API

## MenuContext

It provides methods to handle popup menus imperatively.  The same methods are exposed to the child context with name `menuActions`.

**Note:** It is important that `<MenuContext />` is on the top of the component hierarchy (e.g. `ScrollView` should be inside of `MenuContext`) and wraps all `<Menu />` components.
This is needed in order to solve z-index issues.
The only known exception is when you use [Modal](https://facebook.github.io/react-native/docs/modal.html) - you need to place (additional) 'MenuContext' inside of 'Modal' (see our [ModalExample](../examples/ModalExample.js))

### Methods, `menuActions` context

| Method Name | Arguments | Notes
|---|---|---|
|`openMenu`|`name`|Opens menu by name|
|`toggleMenu`|`name`|Toggle menu by name|
|`closeMenu`||Closes currently opened menu|
|`isMenuOpen`||Returns `true` if any menu is open|

### Properties
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`style`|`Style`|Optional||Style of wrapping `View` component. Same as `customStyles.menuContextWrapper` but when both are present result style is a merge where this style has higher precedence.|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|
|`backHandler`|`boolean\|Function`|Optional|false|Whether to close the menu when the back button is pressed or custom back button handler if a function is passed (RN >= 0.44 is required)|

### Custom styles

To style `<MenuContext />` and backdrop component you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`menuContextWrapper`|`Style`|Style of wrapping `View` component|
|`backdrop`|`Style`|Backdrop `View` style|

**Note:** `Style` type is any valid RN style parameter.
**Note:** In addition to these styles we add also `{flex:1}`. You can disable it by e.g. `style={{flex:0}}`.

See more in custom [styling example](../examples/StylingExample.js).

### Handling of back button

To handle the back button you can pass `backHandler` prop with the following possible values:

| Value | Description |
|---|---|
|false|No handling of back button press|
|true|The menu will be closed|
|Function|The function will be called with `MenuContext` instance as the first parameter. The function needs to return true to prevent application exit (or bubbling if there are other listeners registered). Read [BackHandler documentation](https://facebook.github.io/react-native/docs/backhandler.html) for more information.|

See more in custom [close on back example](../examples/CloseOnBackExample.js).

## Menu

Root menu component defining menu name and providing menu events.

### Methods
| Method Name | Arguments | Notes
|---|---|---|
|`open`||Opens menu|
|`close`||Closes menu|

### Properties
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`name`|`String`|Optional|`auto-generated`|Unique name of menu|
|`opened`|`Boolean`|Optional||Declaratively states if menu is opened. When this prop is provided, menu is controlled and imperative API won't work.|
|`renderer`|`Function`|Optional|`ContextMenu`|Defines position, animation and basic menu styles. See [renderers section](#renderers) for more details|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onSelect`|`optionValue`|Triggered when menu option is selected. When event handler returns `false`, the popup menu remains open|
|`onOpen`||Triggered when menu is opened|
|`onClose`||Triggered when menu is closed|
|`onBackdropPress`||Triggered when user press backdrop (outside of the opened menu)|

### Static Properties
| Property name | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`debug`|`Boolean`|Optional|`false`|This property enables debug logs|

### Static Functions
| Function name | Arguments | Returns | Note |
|---|---|---|---|
|`setDefaultRenderer`| `Function`| | Sets new default renderer. See [renderers section](#renderers) for more details |

## MenuTrigger

It defines position where the popup menu will be rendered.
Menu can by opened by clicking on `<MenuTrigger />` or by calling context methods.

**Note:** It is necessary that `<MenuTrigger />` is a direct child of `<Menu />`.

### Properties
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`disabled`|`Boolean`|Optional|`false`|Indicates if trigger can be pressed|
|`text`|`String`|Optional||Text to be rendered. When this prop is provided, trigger's children won't be rendered|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onPress`||Triggered when trigger is pressed|

### Custom styles

To style `<MenuTrigger />` component you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`triggerOuterWrapper`|`Style`|Style of outer `View` component|
|`triggerWrapper`|`Style`|Style of inner `View` component (can be overriden by `style` prop)|
|`triggerText`|`Style`|Style of `Text` component (used when `text` shorthand option is defined)|
|`TriggerTouchableComponent`|`Component`|Touchable component of trigger. Default value is `TouchableHighlight` for iOS and `TouchableNativeFeedvack` for Android|
|`triggerTouchable`|`Object`|Properties passed to the touchable component (e.g. `activeOpacity`, `underlayColor` for `TouchableHighlight`)|

**Note:** `Style` type is any valid RN style parameter.

See more in custom [styling example](../examples/StylingExample.js) and [touchable example](../examples/TouchableExample.js).

## MenuOptions

This component wrapps all menu options.

**Note:** It is necessary that `<MenuOptions />` is a direct child of `<Menu />`.

### Properties
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`optionsContainerStyle`|`Style`|Optional||Custom styles for options container. Note: this option is deprecated, use `customStyles` option instead|
|`renderOptionsContainer`|`Func`|Optional|`options => options`|Custom render function for `<MenuOptions />`. It takes options component as argument and returns component. E.g.: `options => <SomeCustomContainer>{options}</SomeCustomContainer>`|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|

### Custom styles

To style `<MenuOptions />` and it's `<MenuOption />` components you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`optionsWrapper`|`Style`|Style of wrapping `MenuOptions` component (can be overriden by `style` prop)|
|`optionsContainer`|`Style`|Style passed to the menu renderer (e.g. `Animated.View`)|
|`optionWrapper`|`Style`|Style of `View` component wrapping single option|
|`optionText`|`Style`|Style of `Text` component (when `text` shorthand option is defined)|
|`OptionTouchableComponent`|`Component`|Touchable component of option. Default value is `TouchableHighlight` for iOS and `TouchableNativeFeedvack` for Android|
|`optionTouchable`|`Object`|Properties passed to the touchable component (e.g. `activeOpacity`, `underlayColor` for `TouchableHighlight`)|

**Note:** `optionWrapper`, `optionTouchable` and `optionText` styles of particular menu option can be overriden by `customStyles` prop of `<MenuOption />` component.

**Note:** `Style` type is any valid RN style parameter.

See more in custom [styling example](../examples/StylingExample.js) and [touchable example](../examples/TouchableExample.js).

## MenuOption

Wrapper component of menu option.

### Properties
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`value`|`Any`|Optional||Value of option|
|`text`|`String`|Optional||Text to be rendered. When this prop is provided, option's children won't be rendered|
|`disabled`|`Boolean`|Optional|`false`|Indicates if option can be pressed|
|`disableTouchable`|`Boolean`|Optional|`false`|Disables Touchable wrapper (no on press effect and no onSelect execution) Note: Alternatively you don't have to use `MenuOption` at all if you want render something "non-selectable" in the menu (e.g. divider)|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onSelect`||Triggered when option is selected. When event handler returns `false`, the popup menu remains open. Note: If this event handler is defined, it suppress `onSelect` handler of `<Menu />`|

### Custom styles

To style `<MenuOption />` component you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`optionWrapper`|`Style`|Style of wrapping `View` component.|
|`optionText`|`Style`|Style of `Text` component (when `text` shorthand option is defined)|
|`OptionTouchableComponent`|`Component`|Touchable component of option. Default value is `TouchableHighlight` for iOS and `TouchableNativeFeedvack` for Android|
|`optionTouchable`|`Object`|Properties passed to the touchable component (e.g. `activeOpacity`, `underlayColor` for `TouchableHighlight`)|

**Note:** `Style` type is any valid RN style parameter.

See more in custom [styling example](../examples/StylingExample.js) and [touchable example](../examples/TouchableExample.js).

## renderers

Renderers are react components which wraps `MenuOptions` and are responsible for menu position and animation.
The `renderers` module provides following renderers
* `ContextMenu` (default) - opens (animated) context menu over the trigger position. The `ContextMenu.computePosition` exports function for position calculation in case you would like to implement your own renderer (without special position calculation).
* `NotAnimatedContextMenu` - same as ContextMenu but without any animation.
* `SlideInMenu` - slides in the menu from the bottom of the screen.

It is possible to extend menu and use custom renderer (see implementation of existing renderers or [extension guide](extensions.md)).

**Note:**  If you only need to add styles or wrap `MenuOptions` with your own component, use `customStyles` or `renderOptionsContainer` options of `MenuOptions` instead.
