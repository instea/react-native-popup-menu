import React from 'react';
import { View } from 'react-native';
import { render, normalizeStyle } from '../helpers';

jest.mock('../../src/helpers', () => ({
  computePositionOutside: () => ({ top: 500, left: 500 })
}));

jest.dontMock('../../src/renderers/MenuOutside');
const MenuOutside = require('../../src/renderers/MenuOutside').default;

const { objectContaining, createSpy } = jasmine;

describe('MenuOutside', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuOutside>
        <Text>Some text</Text>
        <Text>Other text</Text>
      </MenuOutside>
    );
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>,
      <Text>Other text</Text>
    ]);
  });

  it('should position component', () => {
    const { output } = render(
      <MenuOutside />
    );
    expect(normalizeStyle(output.props.style)).toEqual(objectContaining({
      top: 500,
      left: 500,
    }));
  });

  it('should have onLayout event handler', () => {
    const onLayoutSpy = createSpy();
    const { instance } = render(
      <MenuOutside onLayout={onLayoutSpy} />
    );
    expect(instance.props.onLayout).toBe(onLayoutSpy);
  });

});
