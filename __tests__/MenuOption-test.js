import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { render } from './helpers';

jest.dontMock('../src/MenuOption');
const MenuOption = require('../src/MenuOption').default;
const { createSpy } = jasmine;

describe('MenuOption', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuOption>
        <Text>Option 1</Text>
      </MenuOption>
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(output.props.children.type).toEqual(View);
    expect(output.props.children.props.children).toEqual(
      <Text>Option 1</Text>
    );
  });

  it('should be enabled by default', () => {
    const { instance } = render(
      <MenuOption />
    );
    expect(instance.props.disabled).toBe(false);
  });

  it('should trigger on select event with value', () => {
    const spy = createSpy();
    const { instance, renderer } = render(
      <MenuOption onSelect={spy} value='hello' />
    );
    const menuActions = { closeMenu: createSpy() };
    instance.context = { menuActions };
    const touchable = renderer.getRenderOutput();
    touchable.props.onPress();
    expect(spy).toHaveBeenCalledWith('hello');
    expect(spy.calls.count()).toEqual(1);
  });

  it('should close menu on select', () => {
    const spy = createSpy();
    const { instance, renderer } = render(
      <MenuOption onSelect={spy} value='hello' />
    );
    const menuActions = { closeMenu: createSpy() };
    instance.context = { menuActions };
    const touchable = renderer.getRenderOutput();
    touchable.props.onPress();
    expect(spy).toHaveBeenCalled();
    expect(menuActions.closeMenu).toHaveBeenCalled();
  });

  it('should not close menu on select', () => {
    const spy = createSpy().and.returnValue(false);
    const { instance, renderer } = render(
      <MenuOption onSelect={spy} value='hello' />
    );
    const menuActions = { closeMenu: createSpy() };
    instance.context = { menuActions };
    const touchable = renderer.getRenderOutput();
    touchable.props.onPress();
    expect(spy).toHaveBeenCalled();
    expect(menuActions.closeMenu).not.toHaveBeenCalled();
  });

  it('should not trigger event when disabled', () => {
    const spy = createSpy();
    const { output } = render(
      <MenuOption onSelect={spy} disabled={true} />
    );
    output.props.onPress();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render text passed in props', () => {
    const { output } = render(
      <MenuOption text='Hello world' />
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(output.props.children.type).toEqual(View);
    const text = output.props.children.props.children;
    expect(text).toEqual(
      <Text>Hello world</Text>
    );
  });

});
