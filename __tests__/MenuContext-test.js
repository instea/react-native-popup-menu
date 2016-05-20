import React from 'react';
import { View } from 'react-native';
import { render, normalizeStyle } from './helpers';
import { MenuOptions, MenuTrigger } from '../src/index';
import Backdrop from '../src/Backdrop';
const { objectContaining, createSpy, any } = jasmine;

jest.dontMock('../src/MenuContext');

jest.mock('../src/menuRegistry', () => () => {
  let menu = {};
  const subscribe = m => (menu = m);
  const unsubscribe = () => (menu = {});
  const getMenu = name => name === menu.name ? menu : undefined;
  const updateLayoutInfo = (name, info) => {
    menu = name === menu.name ? Object.assign({}, menu, info) : menu;
  };
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
    options: <MenuOptions />,
    trigger: <MenuTrigger />,
    events: {
      onOpen: () => 0,
      onClose: () => 0
    }
  };

  const defaultLayout = {
    nativeEvent: {
      layout: {
        width: 400,
        height: 600
      }
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
    expect(typeof output.props.onLayout).toEqual('function');
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
    const { output: initOutput, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
    initOutput.props.onLayout(defaultLayout);
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toEqual(3);
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop.type).toEqual(Backdrop);
    expect(options.ref).toEqual('menu-options');
    expect(options.props.children.type).toEqual(MenuOptions);
  });

  it('should close menu', () => {
    const { output: initOutput, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    initOutput.props.onLayout(defaultLayout);
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
    const { output: initOutput, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    initOutput.props.onLayout(defaultLayout);
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu_not_existing');
    expect(menuActions.isMenuOpen()).toEqual(false);
    const output = renderer.getRenderOutput();
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop).toBeFalsy();
    expect(options).toBeFalsy();
  });

  it('should not open menu if not initialized', () => {
    const { output, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
    const [ components, backdrop, options ] = output.props.children;
    // on layout has not been not called
    expect(components.type).toEqual(View);
    expect(backdrop).toBeFalsy();
    expect(options).toBeFalsy();
  });

  it('should trigger events', () => {
    const { instance } = render(
      <MenuContext />
    );
    const onOpenSpy = createSpy();
    const onCloseSpy = createSpy();
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

  it('should update options layout', () => {
    const { output: initOutput, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    initOutput.props.onLayout(defaultLayout);
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toEqual(3);
    const options = output.props.children[2];
    expect(typeof options.props.onLayout).toEqual('function');
    options.props.onLayout({
      nativeEvent: {
        layout: {
          width: 22,
          height: 33
        }
      }
    });
    expect(menuRegistry.getMenu('menu1')).toEqual(objectContaining({
      optionsLayout: {
        width: 22,
        height: 33
      }
    }));
  });

  it('should render backdrop', () => {
    const { output: initOutput, instance, renderer } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    initOutput.props.onLayout(defaultLayout);
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toEqual(3);
    const backdrop = output.props.children[1];
    expect(backdrop.type).toEqual(Backdrop);
    expect(backdrop.props.dimensions).toEqual(objectContaining({
      width: any(Number),
      height: any(Number)
    }));
  });

  it('should render landscape backdrop', () => {
    const { instance, renderer, output } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    output.props.onLayout({
      nativeEvent: {
        layout: {
          width: 600,
          height: 400
        }
      }
    });
    const nextOutput = renderer.getRenderOutput();
    const backdrop = nextOutput.props.children[1];
    expect(backdrop.type).toEqual(Backdrop);
    expect(backdrop.props.dimensions).toEqual(objectContaining({
      width: 600,
      height: 400
    }));
  });

  it('should render portrait backdrop', () => {
    const { instance, renderer, output } = render(
      <MenuContext />
    );
    const { menuRegistry, menuActions } = instance.getChildContext();
    menuRegistry.subscribe(menu1);
    menuActions.openMenu('menu1');
    expect(typeof output.props.onLayout).toEqual('function');
    output.props.onLayout({
      nativeEvent: {
        layout: {
          width: 400,
          height: 600
        }
      }
    });
    const nextOutput = renderer.getRenderOutput();
    const backdrop = nextOutput.props.children[1];
    expect(backdrop.type).toEqual(Backdrop);
    expect(backdrop.props.dimensions).toEqual(objectContaining({
      width: 400,
      height: 600
    }));
  });

});
