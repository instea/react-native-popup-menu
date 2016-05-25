import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { render } from './helpers';

jest.dontMock('../src/MenuTrigger');
const MenuTrigger = require('../src/MenuTrigger').default;

describe('MenuTrigger', () => {

  const onPress = () => 0;
  const onRef = () => 0;
  const defaultEvents = { onPress, onRef };

  it('should render component', () => {
    const { output } = render(
      <MenuTrigger events={defaultEvents}>
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
      <MenuTrigger events={defaultEvents} text='Trigger text' />
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(output.props.children.type).toEqual(View);
    expect(output.props.children.props.children).toEqual(
      <Text>Trigger text</Text>
    );
  });

  it('should be enabled by default', () => {
    const { instance } = render(
      <MenuTrigger events={defaultEvents} />
    );
    expect(instance.props.disabled).toBe(false);
  });

  it('should trigger on ref event', () => {
    const onRefSpy = jasmine.createSpy();
    const events = {
      onRef: onRefSpy,
      onPress,
    };
    const { output } = render(
      <MenuTrigger events={events} />
    );
    const view = output.props.children;
    expect(typeof view.ref).toEqual('function');
    view.ref();
    expect(onRefSpy).toHaveBeenCalled();
    expect(onRefSpy.calls.count()).toEqual(1);
  });

  it('should trigger on press event', () => {
    const onPressSpy = jasmine.createSpy();
    const events = {
      onPress: onPressSpy,
      onRef
    };
    const { output } = render(
      <MenuTrigger events={events} />
    );
    output.props.onPress();
    expect(onPressSpy).toHaveBeenCalled();
    expect(onPressSpy.calls.count()).toEqual(1);
  });

  it('should not trigger event when disabled', () => {
    const onPressSpy = jasmine.createSpy();
    const events = {
      onPress: onPressSpy,
      onRef
    };
    const { output } = render(
      <MenuTrigger events={events} disabled={true} />
    );
    output.props.onPress();
    expect(onPressSpy).not.toHaveBeenCalled();
  });

});
