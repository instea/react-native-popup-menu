# Extension points

## MenuOption
`MenuOption` component can render any children. However if you want to add icons to all your menu options you can reduce the boilerplate code by writing your own option component.

Simplest example that adds checkmark symbol (unicode 2713).
```
const CheckedOption = (props) => (
  <MenuOption value={props.value} text={'\u2713 ' + props.text} />
)
```

**Note:** `MenuOption` can be placed anywhere inside of `MenuOptions` container. For example it can be rendered using `FlatList`.

## MenuOptions
`<MenuOption />` components are not required to be direct children of `<MenuOptions />`. You can pass any children to `<MenuOptions />` component. For example if you want to wrap options with custom component and add some text above options:

```
const menu = (props) => (
  <Menu>
    <MenuTrigger />
    <MenuOptions>
      <SomeCustomContainer>
        <Text>Some text</Text>
        <MenuOption value={1} text="value 1" />
        <MenuOption value={2} text="value 2" />
      </SomeCustomContainer>
    </MenuOptions>
  </Menu>
);
```

#### Using `renderOptionsContainer` prop (DEPRECATED)
You can also control rendering of `<MenuOptions />` component by passing rendering function into `renderOptionsContainer` property. It takes `<MenuOptions />` component as argument and it have to return react component.

```
const optionsRenderer = (options) => (
  <SomeCustomContainer>
    <Text>Some text</Text>
    {options}
  </SomeCustomContainer>
);
const menu = (props) => (
  <Menu>
    <MenuTrigger />
    <MenuOptions renderOptionsContainer={optionsRenderer}>
      <MenuOption value={1} text="value 1" />
      <MenuOption value={2} text="value 2" />
    </MenuOptions>
  </Menu>
);
```
**Note:** It is highly recommended to use first approach to extend menu options. `renderOptionsContainer` property might be removed in the future versions of the library.

## Custom renderer
It is possible to use different renderer to display menu. There are already few predefined renderers: e.g. `ContextMenu` and `SlideInMenu` (from the `renderers` module). To use it you need to pass it to the `<Menu />` props or use `setDefaultRenderer` (see [API](api.md#static-functions)):

```
import { ..., renderers } from 'react-native-popup-menu';
const menu = (props) => (
  <Menu renderer={renderers.SlideInMenu}>
    ...
  </Menu>
);
```

Responsibility of the renderer is to determine menu position, perform animation and provide basic styles. Here is simple example how to render menu on [0, 0] coordinates:

```
const CustomMenu = (props) => {
  const { style, children, layouts, ...other } = props;
  const position = { top: 0, left: 0 }
  return (
    <View {...other} style={[style, position]}>
      {children}
    </View>
  );
};
```

To compute your own menu position you can use `layouts` property which is an object with properties:

* `triggerLayout` contains dimensions and position of `<Trigger />` component (width, height, x, y).
* `optionsLayout` contains dimensions of `<Options />` component (width, height);
* `windowLayout` contains dimensions and position of working area/window i.e. `<MenuProvider/>` area (width, height, x, y);

In order to handle asynchronous closing animations, renderer can implement `close()`method which is called before menu closes. `close` method has to return `Promise`.

**Note:** It is important that you pass rest of the properties to the wrapping component. We internally pass `onLayout` handler to detect layout change and re-render component. Also it is recommended to re-use styles from props in order to be customizable (via `customStyles.optionsContainer` or `optionsContainerStyle` option). Although for now it might suffice to pass only `onLayout` in addition to other standard props, we highly recommend to pass any properties (as in example) in order to stay compatible with any further versions of the library.
