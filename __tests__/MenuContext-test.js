import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';

jest.dontMock('../src/MenuContext');

jest.mock('../src/menuRegistry', () => () => {
  let menu = {};
  const subscribe = m => (menu = m);
  const unsubscribe = () => (menu = {});
  const getMenu = name => name === menu.name ? menu : undefined;
  const updateLayoutInfo = () => 0;
  const update = () => 0;
  return { getMenu, updateLayoutInfo, subscribe, unsubscribe, update };
});

jest.mock('../src/helpers', () => ({
  measure: () => ({
    then: cb => cb({
      x: 0,
      y: 0,
      width: 100,
      height: 50
    })
  }),
  computeBestMenuPosition: () => ({
    top: 50, left: 0, isVisible: true
  })
}));

const MenuContext = require('../src/MenuContext').default;

describe('MenuContext', () => {

  const menu1 = {
    name: 'menu1',
    options: <View ref='options' />,
    trigger: <View ref='trigger' />,
    events: {
      onOpen: () => 0,
      onClose: () => 0
    }
  };

  it('should expose api', () => {
    const { instance } = render(
      <MenuContext />
    );
    expect(typeof instance.openMenu).toEqual('function');
    expect(typeof instance.closeMenu).toEqual('function');
    expect(typeof instance.toggleMenu).toEqual('function');
    expect(typeof instance.isMenuOpen).toEqual('function');
    const { menuRegistry, menuActions } = instance.getChildContext();
    expect(typeof menuRegistry).toEqual('object');
    expect(typeof menuActions).toEqual('object');
    expect(typeof menuActions.openMenu).toEqual('function');
    expect(typeof menuActions.closeMenu).toEqual('function');
    expect(typeof menuActions.toggleMenu).toEqual('function');
    expect(typeof menuActions.isMenuOpen).toEqual('function');
  });

  it('should render child components', () => {
    const { output } = render(
      <MenuContext>
        <View />
        <Text>Some text</Text>
      </MenuContext>
    );
    expect(output.type).toEqual(View);
    expect(output.props.children.length).toEqual(3);
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop).toBeFalsy();
    expect(options).toBeFalsy();
    expect(components.props.children).toEqual([
      <View />,
      <Text>Some text</Text>
    ]);
  });

  it('should open menu', () => {
    const { instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toEqual(3);
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop.ref).toEqual('backdrop');
    expect(options.ref).toEqual('menu-options');
    expect(options.props.children.ref).toEqual('options');
  });

  it('should close menu', () => {
    const { instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    menuActions.closeMenu();
    expect(menuActions.isMenuOpen()).toEqual(false);
    const output = renderer.getRenderOutput();
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop).toBeFalsy();
    expect(options).toBeFalsy();
  });

  it('should toggle menu', () => {
    const { instance } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.toggleMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
    menuActions.toggleMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(false);
    menuActions.toggleMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
  });

  it('should not open menu', () => {
    const { instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu_not_existing');
    expect(menuActions.isMenuOpen()).toEqual(false);
    const output = renderer.getRenderOutput();
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop).toBeFalsy();
    expect(options).toBeFalsy();
  });

  it('should trigger events', () => {
    const { instance } = render(
      <MenuContext />
    );
    const onOpenSpy = jasmine.createSpy();
    const onCloseSpy = jasmine.createSpy();
    const menu = Object.assign({}, menu1, {
      events: {
        onOpen: onOpenSpy,
        onClose: onCloseSpy
      }
    });
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu);
    menuActions.openMenu('menu1');
    expect(onOpenSpy.calls.count()).toEqual(1);
    expect(onCloseSpy.calls.count()).toEqual(0);
    menuActions.closeMenu('menu1');
    expect(onOpenSpy.calls.count()).toEqual(1);
    expect(onCloseSpy.calls.count()).toEqual(1);
    menuActions.toggleMenu('menu1');
    expect(onOpenSpy.calls.count()).toEqual(2);
    expect(onCloseSpy.calls.count()).toEqual(1);
    menuActions.toggleMenu('menu1');
    expect(onOpenSpy.calls.count()).toEqual(2);
    expect(onCloseSpy.calls.count()).toEqual(2);
  });

});
