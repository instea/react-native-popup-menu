import React from 'react';
import { Animated, Text } from 'react-native';
import { render } from '../helpers';

jest.dontMock('../../src/renderers/SlideInMenu');
const { default: SlideInMenu, computePosition } = require('../../src/renderers/SlideInMenu');

describe('SlideInMenu', () => {

  const defaultLayouts = {
    windowLayout: { width: 400, height: 600 },
    optionsLayout: { width: 50, height: 100 },
  };

  it('should render component', () => {
    const { output } = render(
      <SlideInMenu layouts={defaultLayouts}>
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

  describe('computePosition', () => {
    it('should compute position at the bottom', () => {
      const windowLayout = { width: 400, height: 600 };
      const optionsLayout = { width: 400, height: 100 };
      const layouts = { windowLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 500, left: 0
      });
    });
  });

});
