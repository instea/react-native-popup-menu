import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { render, normalizeStyle } from './helpers';

jest.dontMock('../src/Backdrop');
const Backdrop = require('../src/Backdrop').default;

const { createSpy, objectContaining } = jasmine;

describe('Backdrop', () => {

  it('should render component', () => {
    const { output } = render(
      <Backdrop onPress={createSpy()} dimensions={{
        width: 100, height: 200
      }} />
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    const view = output.props.children;
    expect(view.type).toEqual(View);
    expect(normalizeStyle(view.props.style)).toEqual(objectContaining({
      width: 100, height: 200
    }));
  });

  it('should trigger on press event', () => {
    const onPressSpy = createSpy();
    const { output } = render(
      <Backdrop onPress={onPressSpy} dimensions={{
        width: 100, height: 200
      }} />
    );
    expect(output.type).toEqual(TouchableWithoutFeedback);
    expect(typeof output.props.onPress).toEqual('function');
    output.props.onPress();
    expect(onPressSpy).toHaveBeenCalled();
  });

});
