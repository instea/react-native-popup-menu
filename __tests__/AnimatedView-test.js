import React from 'react';
import { Animated } from 'react-native';
import { render } from './helpers';

jest.dontMock('../src/AnimatedView');
const AnimatedView = require('../src/AnimatedView').default;

describe('AnimatedView', () => {

  it('should render component', () => {
    const { output } = render(
      <AnimatedView>
        <Text>Some text</Text>
        <Text>Other text</Text>
      </AnimatedView>
    );
    expect(output.type).toEqual(Animated.View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>,
      <Text>Other text</Text>
    ]);
  });

});
