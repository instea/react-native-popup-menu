import React from 'react';
import { View } from 'react-native';
import { render } from '../helpers';

jest.dontMock('../../src/renderers/NotAnimatedContextMenu');
const { default: NotAnimatedContextMenu} = require('../../src/renderers/NotAnimatedContextMenu');

describe('NotAnimatedContextMenu', () => {

  const defaultLayouts = {
    windowLayout: { width: 400, height: 600 },
    triggerLayout: { width: 50, height: 50, x: 10, y: 10 },
    optionsLayout: { width: 200, height: 100 },
  };

  describe('renderer', () => {
    it('should render component', () => {
      const { output } = render(
        <NotAnimatedContextMenu layouts={defaultLayouts}>
          <Text>Some text</Text>
          <Text>Other text</Text>
        </NotAnimatedContextMenu>
      );
      expect(output.type).toEqual(View);
      expect(output.props.children).toEqual([
        <Text>Some text</Text>,
        <Text>Other text</Text>
      ]);
    });
  });

});
