import React from 'react';
import { TouchableHighlight, View, Text } from 'react-native';
import { render, normalizeStyle, nthChild } from './helpers';

jest.dontMock('../src/MenuTrigger');
jest.dontMock('../src/helpers');
const MenuTrigger = require('../src/MenuTrigger').default;
const { createSpy, objectContaining } = jasmine;

describe('MenuTrigger', () => {

  it('should render component', () => {
    const { output } = render(
      <MenuTrigger>
        <Text>Trigger Button</Text>
      </MenuTrigger>
    );
    expect(output.type).toEqual(View);
    expect(nthChild(output, 1).type).toEqual(TouchableHighlight);
    expect(nthChild(output, 2).type).toEqual(View);
    expect(nthChild(output, 3)).toEqual(
      <Text>Trigger Button</Text>
    );
  });

  it('should render component using text property', () => {
    const { output } = render(
      <MenuTrigger text='Trigger text' />
    );
    expect(nthChild(output, 1).type).toEqual(TouchableHighlight);
    expect(nthChild(output, 2).type).toEqual(View);
    expect(nthChild(output, 3)).toEqual(
      <Text>Trigger text</Text>
    );
  });

  it('should be enabled by default', () => {
    const { instance } = render(
      <MenuTrigger />
    );
    expect(instance.props.disabled).toBe(false);
  });

  it('should trigger on ref event', () => {
    const onRefSpy = createSpy();
    const { output } = render(
      <MenuTrigger onRef={onRefSpy} />
    );
    expect(typeof output.ref).toEqual('function');
    output.ref();
    expect(onRefSpy).toHaveBeenCalled();
    expect(onRefSpy.calls.count()).toEqual(1);
  });

  it('should open menu', () => {
    const { output, instance } = render(
      <MenuTrigger menuName='menu1' />
    );
    const menuActions = { openMenu: createSpy() };
    instance.context = { menuActions };
    nthChild(output, 1).props.onPress();
    expect(menuActions.openMenu).toHaveBeenCalledWith('menu1');
    expect(menuActions.openMenu.calls.count()).toEqual(1);
  });

  it('should not open menu when disabled', () => {
    const { output, instance } = render(
      <MenuTrigger menuName='menu1' disabled={true} />
    );
    const menuActions = { openMenu: createSpy() };
    instance.context = { menuActions };
    nthChild(output, 1).props.onPress();
    expect(menuActions.openMenu).not.toHaveBeenCalled();
  });

  it('should render trigger with custom styles', () => {
    const customStyles = {
      triggerWrapper: { backgroundColor: 'red' },
      triggerText: { color: 'blue' },
      triggerTouchable: { underlayColor: 'green' },
    };
    const { output } = render(
      <MenuTrigger menuName='menu1' text='some text' customStyles={customStyles} />
    );
    const touchable = nthChild(output, 1);
    const view = nthChild(output, 2);
    const text = nthChild(output, 3);
    expect(normalizeStyle(touchable.props))
      .toEqual(objectContaining({ underlayColor: 'green' }));
    expect(normalizeStyle(view.props.style))
      .toEqual(objectContaining(customStyles.triggerWrapper));
    expect(normalizeStyle(text.props.style))
      .toEqual(objectContaining(customStyles.triggerText));
  });

});
