import React from 'react';
import { Animated } from 'react-native';
import { render, normalizeStyle } from '../helpers';

jest.mock('../../src/helpers', () => ({
  computeSlideInMenuPosition: () => ({ top: 55, left: 10 })
}));

jest.dontMock('../../src/renderers/SlideInMenu');
const SlideInMenu = require('../../src/renderers/SlideInMenu').default;

const { objectContaining } = jasmine;

describe('SlideInMenu', () => {

  const layouts = { windowLayout: { width: 400, height: 600 } };

  it('should render component', () => {
    const { output } = render(
      <SlideInMenu layouts={layouts}>
        <Text>Some text</Text>
        <Text>Other text</Text>
      </SlideInMenu>
    );
    expect(output.type).toEqual(Animated.View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>,
      <Text>Other text</Text>
    ]);
  });

  it('should position component', () => {
    const { output } = render(
      <SlideInMenu layouts={layouts} />
    );
    expect(normalizeStyle(output.props.style)).toEqual(objectContaining({
      top: 55,
      left: 10,
      width: 400,
    }));
  });

});
