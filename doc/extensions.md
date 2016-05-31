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
