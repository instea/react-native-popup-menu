import React from 'react';
import { View } from 'react-native';
import { render, normalizeStyle } from './helpers';
import MenuOption from '../src/MenuOption';

jest.dontMock('../src/MenuOptions');
const MenuOptions = require('../src/MenuOptions').default;
const { objectContaining } = jasmine;

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

  it('should work with user defined options', () => {
    const UserOption = () => <MenuOption text='user-defined' />;

    const onSelect = () => 0;
    const { output } = render(
      <MenuOptions onSelect={onSelect}>
        <UserOption />
      </MenuOptions>
    );
    expect(output.type).toEqual(View);
    const children = output.props.children;
    expect(children.length).toEqual(1);
    const ch = children[0];
    expect(ch.type).toBe(UserOption);
    expect(ch.props.onSelect).toEqual(onSelect);
  });

  it('should render options with custom styles', () => {
    const onSelect = () => 0;
    const styles = {
      optionsContainer: { backgroundColor: 'red' },
      optionText: { color: 'blue' },
    };
    const customOptionStyles = {
      optionText: { color: 'pink' },
    };
    const { output } = render(
      <MenuOptions onSelect={onSelect} styles={styles}>
        <MenuOption />
        <MenuOption styles={customOptionStyles} />
        <MenuOption />
      </MenuOptions>
    );
    expect(normalizeStyle(output.props.style))
      .toEqual(objectContaining(styles.optionsContainer));
    const options = output.props.children;
    expect(options[0].props.styles).toEqual(styles);
    expect(options[1].props.styles).toEqual(customOptionStyles);
    expect(options[2].props.styles).toEqual(styles);
  });

});
