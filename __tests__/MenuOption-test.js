import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
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

  it('should trigger on press event', () => {
    const spy = jasmine.createSpy();
    const { output } = render(
      <MenuOption onPress={spy} />
    );
    output.props.onPress();
    expect(spy).toHaveBeenCalled();
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

});
