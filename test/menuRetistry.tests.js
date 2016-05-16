import { expect } from 'chai';
import makeMenuRetistry from '../src/menuRegistry';

describe('menuRegistry tests', () => {

  const menu1 = {
    name: 'menu1',
    options: [ 1, 2, 3, 4 ],
    trigger: 'trigger1',
    events: { onClick: 5 }
  };

  const menu2 = {
    name: 'menu2',
    options: [ 6, 7 ],
    trigger: 'trigger2',
    events: { onClick: 8 }
  };

  it('should export function', () => {
    expect(makeMenuRetistry).to.be.a('function');
  });

  it('should create an object', () => {
    expect(makeMenuRetistry(new Map())).to.be.an('object');
  });

  describe('getMenu', () => {
    it('should return menu', () => {
      const menus = new Map([
        [menu1.name, menu1]
      ]);
      const registry = makeMenuRetistry(menus);
      expect(registry.getMenu(menu1.name)).to.eql(menu1);
    });
  });

  describe('subscribe', () => {
    it('should subscribe menu', () => {
      const registry = makeMenuRetistry();
      registry.subscribe(menu1.name, menu1);
      expect(registry.getMenu(menu1.name)).to.eql(menu1);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe menu', () => {
      const menus = new Map([
        [menu1.name, menu1],
        [menu2.name, menu2]
      ]);
      const registry = makeMenuRetistry(menus);
      registry.unsubscribe(menu1.name);
      expect(registry.getMenu(menu1.name)).to.be.undefined;
      expect(registry.getMenu(menu2.name)).to.eql(menu2);
    });
  });

  describe('update', () => {
    it('should update subscription', () => {
      const menus = new Map([['menu3', {
        name: 'menu3',
        options: [1, 2],
        trigger: 'trigger3',
        events: { onClick: 3 },
        triggerLayout: 5,
        optionsLayout: 6
      }]]);
      const registry = makeMenuRetistry(menus);
      registry.update('menu3', {
        options: [7, 8],
        trigger: 'trigger3x',
        events: { onClick: 9 }
      });
      expect(registry.getMenu('menu3')).to.eql({
        name: 'menu3',
        options: [7, 8],
        trigger: 'trigger3x',
        events: { onClick: 9 },
        triggerLayout: 5,
        optionsLayout: 6
      });
    });
  });

  describe('updateLayoutInfo', () => {

    it('should update only optionsLayout', () => {
      const menus = new Map([['menu3', {
        name: 'menu3',
        triggerLayout: 5,
        optionsLayout: 6
      }]]);
      const registry = makeMenuRetistry(menus);
      registry.updateLayoutInfo('menu3', { optionsLayout: 7 });
      expect(registry.getMenu('menu3')).to.eql({
        name: 'menu3',
        triggerLayout: 5,
        optionsLayout: 7
      });
    });

    it('should update only triggerLayout', () => {
      const menus = new Map([['menu3', {
        name: 'menu3',
        triggerLayout: 5,
        optionsLayout: 6
      }]]);
      const registry = makeMenuRetistry(menus);
      registry.updateLayoutInfo('menu3', { triggerLayout: 7 });
      expect(registry.getMenu('menu3')).to.eql({
        name: 'menu3',
        triggerLayout: 7,
        optionsLayout: 6
      });
    });

  });

});
