import React from 'react';
import { Animated } from 'react-native';
import { render, normalizeStyle } from '../helpers';

jest.mock('../../src/helpers', () => ({
  computeContextMenuPosition: () => ({ top: 50, left: 5 })
}));

jest.dontMock('../../src/renderers/ContextMenu');
const ContextMenu = require('../../src/renderers/ContextMenu').default;

const { objectContaining } = jasmine;

describe('ContextMenu', () => {

  it('should render component', () => {
    const { output } = render(
      <ContextMenu>
        <Text>Some text</Text>
        <Text>Other text</Text>
      </ContextMenu>
    );
    expect(output.type).toEqual(Animated.View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>,
      <Text>Other text</Text>
    ]);
  });

  it('should position component', () => {
    const { output } = render(
      <ContextMenu />
    );
    expect(normalizeStyle(output.props.style)).toEqual(objectContaining({
      top: 50,
      left: 5,
    }));
  });

});
