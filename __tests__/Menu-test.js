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

  it('should subscribe menu', () => {
    const { instance } = render(
      <Menu name='menu1'>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).toHaveBeenCalledWith('menu1', objectContaining({
      name: 'menu1',
      options: any(Object)
    }));
  });

  it('should not subscribe menu because of missing options', () => {
    const { instance, renderer } = render(
      <Menu name='menu1'>
        <MenuTrigger />
        <Text>Some text</Text>
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).not.toHaveBeenCalled();
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
      <Menu name='menu1'>
        <Text>Some text</Text>
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).not.toHaveBeenCalled();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>
    ]);
  });

  it('should not fail without MenuOptions and MenuTrigger', () => {
    const { instance, renderer } = render(
      <Menu name='menu1'>
        <Text>Some text</Text>
      </Menu>
    );
    const menuRegistry = { subscribe: createSpy(), unsubscribe: createSpy() };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([
      <Text>Some text</Text>
    ]);
    instance.componentWillUnmount();
  });

  it('should not fail without any children', () => {
    const { instance, renderer } = render(
      <Menu>
      </Menu>
    );
    const menuRegistry = { subscribe: createSpy(), unsubscribe: createSpy() };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    const output = renderer.getRenderOutput();
    expect(output.type).toEqual(View);
    expect(output.props.children).toEqual([]);
    instance.componentWillUnmount();
  });

  it('should subscribe events', () => {
    const onOpen = () => 1, onClose = () => 2;
    const { instance } = render(
      <Menu onOpen={ onOpen } onClose={ onClose } name='menu1'>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).toHaveBeenCalledWith('menu1', objectContaining({
      name: 'menu1',
      events: objectContaining({ onOpen, onClose })
    }));
  });

  it('should subscribe menu with auto-generated name', () => {
    const { instance } = render(
      <Menu>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).toHaveBeenCalledWith('generated-name', any(Object));
  });

  it('should unsubscribe menu', () => {
    const { instance } = render(
      <Menu name='menu1'>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy(),
      unsubscribe: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).toHaveBeenCalledWith('menu1', any(Object));
    instance.componentWillUnmount();
    expect(menuRegistry.unsubscribe).toHaveBeenCalledWith('menu1');
  });

  it('should update menu', () => {
    const { instance, output } = render(
      <Menu name='menu1'>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = {
      subscribe: createSpy(),
      update: createSpy()
    };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    const [ trigger ] = output.props.children;
    trigger.props.onRef('trigger_ref');
    instance.componentDidUpdate();
    expect(menuRegistry.update).toHaveBeenCalledWith('menu1', objectContaining({
      name: 'menu1',
      trigger: 'trigger_ref',
    }));
  });

  it('should subscribe onSelect handler', () => {
    const onSelect = () => 0;
    const { instance } = render(
      <Menu name='menu1' onSelect={ onSelect }>
        <MenuTrigger />
        <MenuOptions />
      </Menu>
    );
    const menuRegistry = { subscribe: createSpy() };
    instance.context = { menuRegistry };
    instance.componentDidMount();
    expect(menuRegistry.subscribe).toHaveBeenCalledWith('menu1', objectContaining({
      options: objectContaining({
        props: objectContaining({ onSelect })
      })
    }));
  });

});
