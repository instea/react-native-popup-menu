import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';
import { MenuOption } from '../src/index';

jest.dontMock('../src/MenuOptions');
const MenuOptions = require('../src/MenuOptions').default;

describe('MenuOptions', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuOptions>
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
    });
  });

  it('should accept optional (null) options', () => {
    const option = false;
    const { output } = render(
      <MenuOptions>
        <MenuOption />
        {option ? <MenuOption />: null}
        <MenuOption />
      </MenuOptions>
    );
    expect(output.type).toEqual(View);
    const children = output.props.children;
    expect(children.length).toEqual(3);
  });

  it('should work with user defined options', () => {
    const UserOption = (props) => <MenuOption {...props} text='user-defined' />;
    const { output } = render(
      <MenuOptions>
        <UserOption />
      </MenuOptions>
    );
    expect(output.type).toEqual(View);
    const children = output.props.children;
    expect(children.type).toBe(UserOption);
  });

  it('should register custom styles', () => {
    const customStyles = {
      optionsWrapper: { backgroundColor: 'red' },
      optionText: { color: 'blue' },
    };
    const customStyles2 = {
      optionsWrapper: { backgroundColor: 'blue' },
    };
    const ctx = {
      menuActions: {
        _getOpenedMenu: () => ({
          instance: { getName: () => 'menu1' }
        }),
      },
      menuRegistry: {
        setOptionsCustomStyles: jest.fn(),
      },
    };
    const { instance } = render(
      <MenuOptions customStyles={customStyles} />,
      ctx
    );
    instance.componentDidMount()
    expect(ctx.menuRegistry.setOptionsCustomStyles)
      .toHaveBeenLastCalledWith('menu1', customStyles)
    instance.componentWillReceiveProps({ customStyles: customStyles2 })
    expect(ctx.menuRegistry.setOptionsCustomStyles)
      .toHaveBeenLastCalledWith('menu1', customStyles2)
  });

});
