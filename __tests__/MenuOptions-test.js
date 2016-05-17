import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';
import MenuOption from '../src/MenuOption';

jest.dontMock('../src/MenuOptions');
const MenuOptions = require('../src/MenuOptions').default;

describe('MenuOptions', () => {

  it('should render component', () => {
    const onSelect = () => 0;
    const { output } = render(
      <MenuOptions onSelect={onSelect}>
        <MenuOption />
        <MenuOption />
        <MenuOption />
      </MenuOptions>
    );
    expect(output.type).toEqual(View);
    const children = output.props.children;
    expect(children.length).toEqual(3);
    children.forEach(ch => {
      expect(ch.type).toBe(MenuOption);
      expect(ch.props.onPress).toEqual(onSelect);
    });
  });

});
