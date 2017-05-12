import React from 'react';
import { View, Text } from 'react-native';
import { render } from './helpers';

import { MenuTrigger, MenuOptions } from '../src/index';

jest.mock('../src/helpers', () => ({
  makeName: () => 'generated-name'
}));

jest.dontMock('../src/Menu');
const Menu = require('../src/Menu').default;

const { objectContaining, createSpy, any } = jasmine;

describe('Menu', () => {

  function renderMenu(element) {
    const ctx = createMockContext();
    const result = render(element, ctx);
    result.ctx = ctx;
    return result;
  }

  function createMockContext() {
    return {
      menuRegistry : {
        subscribe: createSpy(),
        unsubscribe: createSpy(),
      },
      menuActions: {
        _notify: createSpy(),
      }
    }
  }

  it('should export api', () => {
    expect(typeof Menu.debug).toEqual('boolean');
    expect(typeof Menu.setDefaultRenderer).toEqual('function');
  });

  it('should render component and preserve children order', () => {
    const { output } = renderMenu(
      <Menu>
        <Text>Some text</Text>
        <MenuTrigger />
        <MenuOptions />
        <Text>Some other text</Text>
      </Menu>
    );
    expect(output.type).toEqual(View);
    expect(output.props.children.length).toEqual(3);
    expect(output.props.children[0]).toEqual(
      <Text>Some text</Text>
    );
    expect(output.props.children[1]).toEqual(objectContaining({
      type: MenuTrigger,
      props: objectContaining({
        onRef: any(Function)
      })
    }));
    expect(output.props.children[2]).toEqual(
      <Text>Some other text</Text>
    );
  });

  it('should subscribe menu and notify context', () => {
    const { ctx, instance } = renderMenu(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    instance.componentDidMount();
    expect(ctx.menuRegistry.subscribe).toHaveBeenCalledWith(instance);
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should not subscribe menu because of missing options', () => {
    const { instance, renderer, ctx } = renderMenu(
      <Menu>
        <MenuTrigger />
        <Text>Some text</Text>
      </Menu>
    );
    instance.componentDidMount();
    expect(ctx.menuRegistry.subscribe).not.toHaveBeenCalled();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      objectContaining({
        type: MenuTrigger
      }),
      <Text>Some text</Text>
    ]);
  });

  it('should not subscribe menu because of missing trigger', () => {
    const { instance, renderer, ctx } = renderMenu(
      <Menu>
        <Text>Some text</Text>
        <MenuOptions />
      </Menu>
    );
    instance.componentDidMount();
    expect(ctx.menuRegistry.subscribe).not.toHaveBeenCalled();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>
    ]);
  });

  it('should not fail without any children', () => {
    const { instance, renderer } = renderMenu(
      <Menu/>
    );
    instance.componentDidMount();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([]);
    instance.componentWillUnmount();
  });

  it('should autogenerate name if not provided', () => {
    const { instance } = renderMenu(
      <Menu/>
    );
    expect(instance.getName()).toEqual('generated-name');
  });

  it('should use name from props if provided', () => {
    const { instance } = renderMenu(
      <Menu name='prop-name'/>
    );
    expect(instance.getName()).toEqual('prop-name');
  });

  it('should unsubscribe menu', () => {
    const { instance, ctx } = renderMenu(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    instance.componentWillUnmount();
    expect(ctx.menuRegistry.unsubscribe).toHaveBeenCalledWith(instance);
  });

  it('should notify context if updated', () => {
    const { instance, ctx } = renderMenu(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    instance.componentDidUpdate();
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should forward on select handler to menu options', () => {
    const onSelect = () => 0;
    const { instance } = renderMenu(
      <Menu onSelect={ onSelect }>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const options = instance._getOptions();
    expect(options.type).toEqual(MenuOptions);
    expect(options.props.onSelect).toEqual(onSelect);
  });

  it('declarative opened takes precedence over imperative', () => {
    const { instance } = renderMenu(
      <Menu opened={false}/>
    );
    instance._setOpened(true);
    expect(instance._isOpen()).toEqual(false);
    expect(instance._getOpened()).toEqual(true);
  });

  it('imperative opened is used if no declarative', () => {
    const { instance } = renderMenu(
      <Menu/>
    );
    instance._setOpened(true);
    expect(instance._isOpen()).toEqual(true);
  });

  it('should be considered closed after unmount', () => {
    const { instance, ctx } = renderMenu(
      <Menu opened={true}>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    expect(instance._isOpen()).toEqual(true);
    instance.componentWillUnmount();
    expect(instance._isOpen()).toEqual(false);
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should know its trigger reference', () => {
    const triggerRef = 9;
    const { instance, output } = renderMenu(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    output.props.children[0].props.onRef(triggerRef);
    expect(instance._getTrigger()).toEqual(triggerRef);
  });


});
