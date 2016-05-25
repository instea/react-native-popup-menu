import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { render } from './helpers';

jest.dontMock('../src/MenuOption');
const MenuOption = require('../src/MenuOption').default;

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

  it('should trigger on press event with value', () => {
    const spy = jasmine.createSpy();
    const { output } = render(
      <MenuOption onPress={spy} value='hello' />
    );
    output.props.onPress();
    expect(spy).toHaveBeenCalledWith('hello', undefined);
    expect(spy.calls.count()).toEqual(1);
  });

  it('should trigger on press event with onSelect handler', () => {
    const spy = jasmine.createSpy();
    const onSelect = () => 1;
    const { output } = render(
      <MenuOption onPress={spy} value='some value' onSelect={onSelect} />
    );
    output.props.onPress();
    expect(spy).toHaveBeenCalledWith('some value', onSelect);
    expect(spy.calls.count()).toEqual(1);
  });

  it('should not trigger event when disabled', () => {
    const spy = jasmine.createSpy();
    const { output } = render(
      <MenuOption onPress={spy} disabled={true} />
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
