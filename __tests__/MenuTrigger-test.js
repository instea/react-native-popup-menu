import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { render, normalizeStyle } from './helpers';

jest.dontMock('../src/MenuTrigger');
const MenuTrigger = require('../src/MenuTrigger').default;
const { createSpy, objectContaining } = jasmine;

describe('MenuTrigger', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuTrigger>
        <Text>Trigger Button</Text>
      </MenuTrigger>
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(output.props.children.type).toEqual(View);
    expect(output.props.children.props.children).toEqual(
      <Text>Trigger Button</Text>
    );
  });

  it('should render component using text property', () => {
    const { output } = render(
      <MenuTrigger text='Trigger text' />
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(output.props.children.type).toEqual(View);
    expect(output.props.children.props.children).toEqual(
      <Text>Trigger text</Text>
    );
  });

  it('should be enabled by default', () => {
    const { instance } = render(
      <MenuTrigger />
    );
    expect(instance.props.disabled).toBe(false);
  });

  it('should trigger on ref event', () => {
    const onRefSpy = createSpy();
    const { output } = render(
      <MenuTrigger onRef={onRefSpy} />
    );
    const view = output.props.children;
    expect(typeof view.ref).toEqual('function');
    view.ref();
    expect(onRefSpy).toHaveBeenCalled();
    expect(onRefSpy.calls.count()).toEqual(1);
  });

  it('should open menu', () => {
    const { output, instance } = render(
      <MenuTrigger menuName='menu1' />
    );
    const menuActions = { openMenu: createSpy() };
    instance.context = { menuActions };
    output.props.onPress();
    expect(menuActions.openMenu).toHaveBeenCalledWith('menu1');
    expect(menuActions.openMenu.calls.count()).toEqual(1);
  });

  it('should not open menu when disabled', () => {
    const { output, instance } = render(
      <MenuTrigger menuName='menu1' disabled={true} />
    );
    const menuActions = { openMenu: createSpy() };
    instance.context = { menuActions };
    output.props.onPress();
    expect(menuActions.openMenu).not.toHaveBeenCalled();
  });

  it('should render trigger with custom styles', () => {
    const styles = {
      triggerWrapper: { backgroundColor: 'red' },
      triggerText: { color: 'blue' },
      triggerTouchable: { backgroundColor: 'green' },
    };
    const { output } = render(
      <MenuTrigger menuName='menu1' text='some text' styles={styles} />
    );
    const touchable = output;
    const wrapper = touchable.props.children;
    const text = wrapper.props.children;
    expect(normalizeStyle(touchable.props.style))
      .toEqual(objectContaining(styles.triggerTouchable));
    expect(normalizeStyle(wrapper.props.style))
      .toEqual(objectContaining(styles.triggerWrapper));
    expect(normalizeStyle(text.props.style))
      .toEqual(objectContaining(styles.triggerText));
  });

});
