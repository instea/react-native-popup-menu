# API

## MenuContext

It provides methods to handle popup menus imperatively.  The same methods are exposed to the child context with name `menuActions`.

**Note:** It is important that `<MenuContext />` is on the top of the component hierarchy and wrap all `<Menu />` components.
This is needed in order to solve z-index issues.

### Methods, `menuActions` context

| Method Name | Arguments | Notes
|---|---|---|
|`openMenu`|`name`|Opens menu by name|
|`toggleMenu`|`name`|Toggle menu by name|
|`closeMenu`||Closes currently opened menu|
|`isMenuOpen`||Returns `true` if any menu is open|

## Menu

Root menu component defining menu name and providing menu events.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`name`|`String`|Optional|`auto-generated`|Unique name of menu|
|`opened`|`Boolean`|Optional||Declaratively states if menu is opened. When this prop is provided, menu is controlled and imperative API won't work.|
|`renderer`|`Function`|Optional|`ContextMenu`|Defines position, animation and basic menu styles (currently available renderers are `ContextMenu` and `SlideInMenu`). See [renderers section](#renderers) for more details|

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

## MenuTrigger

It defines position where the popup menu will be rendered.
Menu can by opened by clicking on `<MenuTrigger />` or by calling context methods.

**Note:** It is necessary that `<MenuTrigger />` is a direct child of `<Menu />`.

### Options
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
|`triggerWrapper`|`Object`|Style of wrapping `View` component|
|`triggerTouchable`|`Object`|Style props of `TouchableHighlight`. Supported keys: `activeOpacity`, `underlayColor`|
|`triggerText`|`Object`|Style of `Text` component (used when `text` shorthand option is defined)|

See more in custom styling [example](../examples/StylingExample.js).

## MenuOptions

This component wrapps all menu options.

**Note:** It is necessary that `<MenuOptions />` is a direct child of `<Menu />`.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`optionsContainerStyle`|`Style`|Optional||Custom styles for options container. Note: this option is deprecated, use `customStyles` option instead|
|`renderOptionsContainer`|`Func`|Optional|`options => options`|Custom render function for `<MenuOptions />`. It takes options component as argument and returns component. E.g.: `options => <SomeCustomContainer>{options}</SomeCustomContainer>`|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|

### Custom styles

To style `<MenuOptions />` and it's `<MenuOption />` components you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`optionsWrapper`|`Object`|Style of wrapping `View` component|
|`optionsContainer`|`Object`|Style of wrapping `AnimatedView` component|
|`optionWrapper`|`Object`|Style of wrapping `View` component.|
|`optionTouchable`|`Object`|Style props of `TouchableHighlight`. Supported keys: `activeOpacity`, `underlayColor`|
|`optionText`|`Object`|Style of `Text` component (when `text` shorthand option is defined)|

**Note:** `optionWrapper`, `optionTouchable` and `optionText` styles of particular menu option can be overriden by `customStyles` prop of `<MenuOption />` component.

See more in custom styling [example](../examples/StylingExample.js).

## MenuOption

Wrapper component of menu option.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`value`|`Any`|Optional||Value of option|
|`text`|`String`|Optional||Text to be rendered. When this prop is provided, option's children won't be rendered|
|`disabled`|`Boolean`|Optional|`false`|Indicates if option can be pressed|
|`customStyles`|`Object`|Optional||Object defining wrapper, touchable and text styles|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onSelect`||Triggered when option is selected. When event handler returns `false`, the popup menu remains open. Note: If this event handler is defined, it suppress `onSelect` handler of `<Menu />`|

### Custom styles

To style `<MenuOption />` component you can pass `customStyles` object prop with following keys:

| Object key | Type | Notes |
|---|---|---|
|`optionWrapper`|`Object`|Style of wrapping `View` component.|
|`optionTouchable`|`Object`|Style props of `TouchableHighlight`. Supported keys: `activeOpacity`, `underlayColor`|
|`optionText`|`Object`|Style of `Text` component (when `text` shorthand option is defined)|

See more in custom styling [example](../examples/StylingExample.js).

## renderers

Renderers are react components which wraps `MenuOptions` and are responsible for menu position and animation.
In `renderers` module there are already provided two renderers - `ContextMenu` (default) and `SlideInMenu`.
It is possible to extend menu and use custom renderer (see implementation of existing renderers).

NOTE: If you only need to add styles or wrap `MenuOptions` with your own component, use `customStyles` or `renderOptionsContainer` options of `MenuOptions` instead.
