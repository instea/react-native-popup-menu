import React from 'react';
import { Animated } from 'react-native';
import { render } from '../helpers';

jest.dontMock('../../src/renderers/ContextMenu');
const { default: ContextMenu, computePosition } = require('../../src/renderers/ContextMenu');

describe('ContextMenu', () => {

  const windowLayout = { width: 400, height: 600, x: 0, y: 0 };
  const defaultLayouts = {
    windowLayout,
    triggerLayout: { width: 50, height: 50, x: 10, y: 10 },
    optionsLayout: { width: 200, height: 100 },
  };

  describe('renderer', () => {
    it('should render component', () => {
      const { output } = render(
        <ContextMenu layouts={defaultLayouts}>
          <Text>Some text</Text>
          <Text>Other text</Text>
        </ContextMenu>
      );
      expect(output.type).toEqual(Animated.View);
      expect(output.props.children).toEqual([
        <Text>Some text</Text>,
        <Text>Other text</Text>
      ]);
    });
  });

  describe('computePosition', () => {
    it('should be exported', () => {
        expect(typeof ContextMenu.computePosition).toEqual('function');
    });

    it('should returns default-top-left position', () => {
      const triggerLayout = { width: 50, height: 50, x: 100, y: 100 };
      const optionsLayout = { width: 50, height: 50 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 100, left: 100
      });
    });

    it('should returns top-left position', () => {
      const triggerLayout = { width: 50, height: 50, x: 10, y: 10 };
      const optionsLayout = { width: 50, height: 50 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 10, left: 10
      });
    });

    it('should returns top-right position', () => {
      const triggerLayout = { width: 100, height: 50, x: 300, y: 0 };
      const optionsLayout = { width: 150, height: 100 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 0, left: 250
      });
    });

    it('should returns bottom-left position', () => {
      const triggerLayout = { width: 100, height: 100, x: 10, y: 500 };
      const optionsLayout = { width: 150, height: 150 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 450, left: 10
      });
    });

    it('should returns bottom-right position', () => {
      const triggerLayout = { width: 100, height: 100, x: 300, y: 500 };
      const optionsLayout = { width: 150, height: 150 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 450, left: 250
      });
    });

    it('should return horizontal middle position', () => {
      const triggerLayout = { width: 100, height: 20, x: 10, y: 290 };
      const optionsLayout = { width: 150, height: 500 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 50, left: 10
      });
    });

    it('should return vertical middle position', () => {
      const triggerLayout = { width: 100, height: 20, x: 150, y: 10 };
      const optionsLayout = { width: 300, height: 100 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 10, left: 50
      });
    });

    it('should return zero top position for big menus', () => {
      const triggerLayout = { width: 100, height: 20, x: 10, y: 290 };
      const optionsLayout = { width: 150, height: 700 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 0, left: 10
      });
    });

    it('should return zero left position for big menus', () => {
      const triggerLayout = { width: 100, height: 20, x: 150, y: 10 };
      const optionsLayout = { width: 500, height: 100 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 10, left: 0
      });
    });

    it('should return zero top because of overlaping cener position', () => {
      const triggerLayout = { width: 100, height: 20, x: 10, y: 200 };
      const optionsLayout = { width: 150, height: 500 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 0, left: 10
      });
    });

    it('should return zero bottom because of overlaping cener position', () => {
      const triggerLayout = { width: 100, height: 20, x: 10, y: 450 };
      const optionsLayout = { width: 150, height: 500 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 100, left: 10
      });
    });

    it('should return zero left because of overlaping cener position', () => {
      const triggerLayout = { width: 1, height: 20, x: 100, y: 10 };
      const optionsLayout = { width: 350, height: 50 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 10, left: 0
      });
    });

    it('should consider window offset', () => {
      const windowLayout = { width: 400, height: 600, x: 20, y: 30 };
      const triggerLayout = { width: 50, height: 50, x: 100, y: 100 };
      const optionsLayout = { width: 50, height: 50 };
      const layouts = { windowLayout, triggerLayout, optionsLayout };
      expect(computePosition(layouts)).toEqual({
        top: 70, left: 80
      });
    });

  });

});
