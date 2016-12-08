import React from 'react';
import { View } from 'react-native';
import { render } from './helpers';
import { MenuOptions, MenuTrigger } from '../src/index';
import MenuOutside from '../src/renderers/MenuOutside';
import Backdrop from '../src/Backdrop';
import ContextMenu from '../src/renderers/ContextMenu';
const { objectContaining, createSpy } = jasmine;

jest.dontMock('../src/MenuContext');
jest.dontMock('../src/menuRegistry');

jest.mock('../src/helpers', () => ({
  measure: () => ({
    then: cb => cb({
      x: 0,
      y: 0,
      width: 100,
      height: 50
    })
  }),
  lo: x => x,
}));

const MenuContext = require('../src/MenuContext').default;

describe('MenuContext', () => {

  /* eslint-disable react/display-name */
  function makeMenuStub(name) {
    let opened = false;
    return {
      getName: ()=>name,
      _getOpened: ()=>opened,
      _setOpened: (value)=>opened=value,
      _isOpen: ()=>opened,
      _getTrigger: ()=>(<MenuTrigger/>),
      _getOptions: ()=>(<MenuOptions/>),
      props : {
        onOpen: createSpy(),
        onClose: createSpy(),
        onBackdropPress: createSpy(),
        type: 'context',
        renderer: ContextMenu,
      },
    }
  }

  const menu1 = makeMenuStub('menu1')

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
    // plus internal methods
    expect(typeof menuActions._notify).toEqual('function');
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
    expect(menu1._getOpened()).toEqual(true);
    initOutput.props.onLayout(defaultLayout);
    // next render will start rendering open menu
    const output = renderer.getRenderOutput();
    expect(output.props.children.length).toEqual(3);
    const [ components, backdrop, options ] = output.props.children;
    expect(components.type).toEqual(View);
    expect(backdrop.type).toEqual(Backdrop);
    expect(options.type).toEqual(MenuOutside);
    // on open was called only once
    expect(menu1.props.onOpen.calls.count()).toEqual(1);
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
    expect(menu1.props.onClose).toHaveBeenCalled()
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
    expect(menu1._isOpen()).toEqual(true);
    menuActions.toggleMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(false);
    expect(menu1._isOpen()).toEqual(false);
    menuActions.toggleMenu('menu1');
    expect(menuActions.isMenuOpen()).toEqual(true);
  });

  it('should not open non existing menu', () => {
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
    const { output, instance } = render(
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
        isOutside: true,
        height: 33
      }
    }));
  });

  it('should render backdrop that will trigger onBackdropPress', () => {
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
    backdrop.props.onPress();
    expect(menu1.props.onBackdropPress).toHaveBeenCalled();
  });

});
