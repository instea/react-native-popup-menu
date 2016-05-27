import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';

import { MenuTrigger, MenuOptions } from '../src/index';

jest.mock('../src/helpers', () => ({
  makeName: () => 'generated-name'
}));

jest.dontMock('../src/Menu');
const Menu = require('../src/Menu').default;

const { objectContaining, createSpy, any } = jasmine;

describe('Menu', () => {

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

  it('should render component and preserve children order', () => {
    const { output } = render(
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
    const { instance } = render(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    instance.componentDidMount();
    expect(ctx.menuRegistry.subscribe).toHaveBeenCalledWith(instance);
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should not subscribe menu because of missing options', () => {
    const { instance, renderer } = render(
      <Menu>
        <MenuTrigger />
        <Text>Some text</Text>
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
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
    const { instance, renderer } = render(
      <Menu>
        <Text>Some text</Text>
        <MenuOptions />
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    instance.componentDidMount();
    expect(ctx.menuRegistry.subscribe).not.toHaveBeenCalled();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>
    ]);
  });

  it('should not fail without any children', () => {
    const { instance, renderer } = render(
      <Menu/>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    instance.componentDidMount();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([]);
    instance.componentWillUnmount();
  });

  it('should autogenerate name if not provided', () => {
    const { instance } = render(
      <Menu/>
    );
    expect(instance.getName()).toEqual('generated-name');
  });

  it('should use name from props if provided', () => {
    const { instance } = render(
      <Menu name='prop-name'/>
    );
    expect(instance.getName()).toEqual('prop-name');
  });

  it('should unsubscribe menu', () => {
    const { instance } = render(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    instance.componentWillUnmount();
    expect(ctx.menuRegistry.unsubscribe).toHaveBeenCalledWith(instance);
  });

  it('should notify context if updated', () => {
    const { instance } = render(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    instance.componentDidUpdate();
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should forward on select handler to menu options', () => {
    const onSelect = () => 0;
    const { instance } = render(
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
    const { instance } = render(
      <Menu opened={false}/>
    );
    instance._setOpened(true);
    expect(instance._isOpen()).toEqual(false);
    expect(instance._getOpened()).toEqual(true);
  });

  it('imperative opened is used if no declarative', () => {
    const { instance } = render(
      <Menu/>
    );
    instance._setOpened(true);
    expect(instance._isOpen()).toEqual(true);
  });

  it('should be considered closed after unmount', () => {
    const { instance } = render(
      <Menu opened={true}>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const ctx = createMockContext();
    instance.context = ctx;
    expect(instance._isOpen()).toEqual(true);
    instance.componentWillUnmount();
    expect(instance._isOpen()).toEqual(false);
    expect(ctx.menuActions._notify).toHaveBeenCalled();
  });

  it('should know its trigger reference', () => {
    const triggerRef = 9;
    const { instance, output } = render(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    output.props.children[0].props.onRef(triggerRef);
    expect(instance._getTrigger()).toEqual(triggerRef);
  });


});
