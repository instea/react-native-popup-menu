# Extension points

## MenuOption
`MenuOption` component can render any children. However if you want to add icons to all your menu options you can reduce the boilerplate code by writing your own option component.

Simplest example that adds checkmark symbol (unicode 2713).
```
const CheckedOption = (props) => (
  <MenuOption {...props} text={'\u2713 ' + props.text} />
)
```

**Note:** It is important that you pass all properties to underlying `MenuOption`. We internally pass `onSelect` handler to all menu options so that we can react to user actions. Although for now it might suffice to pass only `onSelect` in addition to other standard props, we highly recommend to pass any properties (as in example) in order to stay compatible with any further versions of the library.

## MenuOptions - renderOptionsContainer
You can control rendering of `<MenuOptions />` component by passing rendering function into `renderOptionsContainer` property. It takes `<MenuOptions />` component as argument and it have to return react component. For example if you want to wrap options with custom component and add some text above options:

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
    <MenuOptions renderOptionsContainer={optionsRenderer} />
  </Menu>
);
```

## Custom renderer
It is possible to use different renderer to display menu. There are already two predefined renderers: `ContextMenu` and `SlideInMenu` (from the `renderers` module). To use it you need to pass it to the `<Menu />` props:

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

To compute your own menu position you can use `layouts` property which has properties:

* `triggerLayout` constains dimensions and position of `<Trigger />` component (width, height, x, y).
* `optionsLayout` contains dimensions of `<Options />` component (width, height);
* `windowLayout` contains dimensions of the device window (width, height);

**Note:** It is important that you pass rest of the properties to the wrapping component. We internally pass `onLayout` handler to detect layout change and re-render component. Also it is recommended to re-use styles from props which are exactly the styles provided in `optionsContainerStyle` option of `MenuOptions`. Although for now it might suffice to pass only `onLayout` in addition to other standard props, we highly recommend to pass any properties (as in example) in order to stay compatible with any further versions of the library.
