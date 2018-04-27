import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';
import { MenuOption } from '../src/index';

jest.dontMock('../src/MenuOptions');
const { MenuOptions } = require('../src/MenuOptions');

describe('MenuOptions', () => {

  function mockCtx() {
    return {
      menuActions: {
        _getOpenedMenu: () => ({
          instance: { getName: () => 'menu1' }
        }),
      },
      menuRegistry: {
        setOptionsCustomStyles: jest.fn(),
      },
    };
  }

  it('should render component', () => {
    const { output } = render(
      <MenuOptions>
        <MenuOption />
        <MenuOption />
        <MenuOption />
      </MenuOptions>,
      mockCtx()
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
      </MenuOptions>,
      mockCtx()
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
      </MenuOptions>,
      mockCtx()
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
    const ctx = mockCtx();
    const { instance, renderer } = render(
      <MenuOptions customStyles={customStyles} />,
      ctx
    );
    instance.componentDidMount();
    expect(ctx.menuRegistry.setOptionsCustomStyles)
      .toHaveBeenLastCalledWith('menu1', customStyles)
    renderer.render(<MenuOptions customStyles={customStyles2} ctx={ctx} />)
    instance.componentDidUpdate();
    expect(ctx.menuRegistry.setOptionsCustomStyles)
      .toHaveBeenLastCalledWith('menu1', customStyles2)
  });

});
