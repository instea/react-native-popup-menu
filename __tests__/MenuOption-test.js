import React from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import { render, normalizeStyle, nthChild } from './helpers';

jest.dontMock('../src/MenuOption');
jest.dontMock('../src/helpers');
const MenuOption = require('../src/MenuOption').default;
const { createSpy, objectContaining } = jasmine;

describe('MenuOption', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuOption>
        <Text>Option 1</Text>
      </MenuOption>
    );
    expect(output.type).toEqual(TouchableHighlight);
    expect(nthChild(output, 1).type).toEqual(View);
    expect(nthChild(output, 2)).toEqual(
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
    expect(output.type).toBe(View);
    expect(output.props.onPress).toBeUndefined();
  });

  it('should render text passed in props', () => {
    const { output } = render(
      <MenuOption text='Hello world' />
    );
    expect(output.type).toEqual(TouchableHighlight);
    expect(output.props.children.type).toEqual(View);
    const text = output.props.children.props.children;
    expect(text).toEqual(
      <Text>Hello world</Text>
    );
  });

  it('should render component with custom styles', () => {
    const customStyles = {
      optionWrapper: { backgroundColor: 'red' },
      optionText: { color: 'blue' },
      optionTouchable: { underlayColor: 'green' },
    };
    const { output } = render(
      <MenuOption text='some text' customStyles={customStyles} />
    );
    const touchable = output;
    const view = nthChild(output, 1);
    const text = nthChild(output, 2);
    expect(normalizeStyle(touchable.props))
      .toEqual(objectContaining({ underlayColor: 'green' }));
    expect(normalizeStyle(view.props.style))
      .toEqual(objectContaining(customStyles.optionWrapper));
    expect(normalizeStyle(text.props.style))
      .toEqual(objectContaining(customStyles.optionText));
  });

});
