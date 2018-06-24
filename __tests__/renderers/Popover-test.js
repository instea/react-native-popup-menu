import React from 'react';
import { View, Animated, Text } from 'react-native';
import { render } from '../helpers';

jest.dontMock('../../src/renderers/Popover');
const { default: Popover } = require('../../src/renderers/Popover');

describe('Popover', () => {

  const defaultLayouts = {
    windowLayout: { width: 400, height: 600, x: 0, y: 0 },
    triggerLayout: { width: 50, height: 50, x: 10, y: 10 },
    optionsLayout: { width: 200, height: 100 },
  };

  describe('renderer', () => {
    it('should render component', () => {
      const { output } = render(
        <Popover layouts={defaultLayouts}>
          <Text>Some text</Text>
          <Text>Other text</Text>
        </Popover>
      );
      expect(output.type).toEqual(Animated.View);
      const anchor = output.props.children[0]
      expect(anchor.type).toEqual(View);
      const content = output.props.children[1]
      expect(content.type).toEqual(View);
      expect(content.props.children).toEqual([
        <Text>Some text</Text>,
        <Text>Other text</Text>,
      ]);
    });
  });

});
