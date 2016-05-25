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
      expect(ch.props.onSelect).toEqual(onSelect);
    });
  });

  it("should prioritize option's onSelect handler", () => {
    const onSelect = () => 0;
    const onSelectOption = () => 1;
    const { output } = render(
      <MenuOptions onSelect={onSelect}>
        <MenuOption onSelect={onSelectOption} />
        <MenuOption />
      </MenuOptions>
    );
    expect(output.type).toEqual(View);
    const children = output.props.children;
    expect(children.length).toEqual(2);
    expect(children[0].type).toBe(MenuOption);
    expect(children[1].type).toBe(MenuOption);
    expect(children[0].props.onSelect).toEqual(onSelectOption);
    expect(children[1].props.onSelect).toEqual(onSelect);
  });

});
