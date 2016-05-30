# API

## MenuContext

It provides methods to handle popup menus imperatively.  The same methods are exposed to the child context with name `menuActions`.

### Methods, `menuActions` context

| Method Name | Arguments | Notes
|---|---|---|
|`openMenu`|`name`|Opens menu by name|
|`toggleMenu`|`name`|Toggle menu by name|
|`closeMenu`||Closes currently opened menu|
|`isMenuOpen`||Returns `true` if any menu is open|

**Note:** It is important that `<MenuContext />` is on the top of the component hierarchy and wrap all `<Menu />` components.
This is needed in order to solve z-index issues.

## Menu

Root menu component defining menu name and providing menu events.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`name`|`String`|Optional|`auto-generated`|Unique name of menu|
|`opened`|`Boolean`|Optional||Declaratively states if menu is opened. When this prop is provided, menu is controlled and imperative API won't work.|

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

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`disabled`|`Boolean`|Optional|`false`|Indicates if trigger can be pressed|
|`text`|`String`|Optional||Text to be rendered. When this prop is provided, trigger's children won't be rendered|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onPress`||Triggered when trigger is pressed|

**Note:** It is necessary that `<MenuTrigger />` is a direct child of `<Menu />`.

## MenuOptions

This component wrapps all menu options.

**Note:** It is necessary that `<MenuOptions />` is a direct child of `<Menu />`.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`optionsContainerStyle`|`Style`|Optional||Custom styles for options container|
|`renderOptionsContainer`|`Func`|Optional|`options => options`|Custom render function for `<MenuOptions />`. It takes options component as argument and returns component. E.g.: `options => <SomeCustomContainer>{options}</SomeCustomContainer>`|

## MenuOption

Wrapper component of menu option.

### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`value`|`Any`|Optional||Value of option|
|`text`|`String`|Optional||Text to be rendered. When this prop is provided, option's children won't be rendered|
|`disabled`|`Boolean`|Optional|`false`|Indicates if option can be pressed|

### Events
| Event Name | Arguments | Notes |
|---|---|---|
|`onSelect`||Triggered when option is selected. When event handler returns `false`, the popup menu remains open. Note: If this event handler is defined, it suppress `onSelect` handler of `<Menu />`|

