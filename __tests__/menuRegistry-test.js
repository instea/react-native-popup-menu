import { expect } from 'chai';

jest.dontMock('../src/menuRegistry');
const makeMenuRegistry = require('../src/menuRegistry').default;

describe('menuRegistry tests', () => {

  const menu1 = {
    getName : () => 'menu1',
  };

  const menu2 = {
    getName : () => 'menu2',
  };

  it('should export function', () => {
    expect(makeMenuRegistry).to.be.a('function');
  });

  it('should create an object', () => {
    expect(makeMenuRegistry(new Map())).to.be.an('object');
  });

  describe('getMenu', () => {
    it('should return menu', () => {
      const menus = new Map([
        ['menu1', {instance: menu1}]
      ]);
      const registry = makeMenuRegistry(menus);
      expect(registry.getMenu('menu1').instance).to.eql(menu1);
    });
  });

  describe('subscribe', () => {
    it('should subscribe menu', () => {
      const registry = makeMenuRegistry();
      registry.subscribe(menu1);
      expect(registry.getMenu('menu1')).to.eql({name: 'menu1', instance: menu1});
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe menu', () => {
      const menus = new Map([
        ['menu1', {name:'menu1', instance: menu1}],
        ['menu2', {name:'menu2', instance: menu2}]
      ]);
      const registry = makeMenuRegistry(menus);
      registry.unsubscribe(menu1);
      expect(registry.getMenu('menu1')).to.be.undefined;
      expect(registry.getMenu('menu2')).to.eql({name:'menu2', instance: menu2});
    });
  });

  describe('updateLayoutInfo', () => {

    it('should update only optionsLayout', () => {
      const menus = new Map([['menu1', {
        name: 'menu1',
        instance: menu1,
        triggerLayout: 5,
        optionsLayout: 6,
      }]]);
      const registry = makeMenuRegistry(menus);
      registry.updateLayoutInfo('menu1', { optionsLayout: 7 });
      expect(registry.getMenu('menu1')).to.eql({
        name: 'menu1',
        instance: menu1,
        triggerLayout: 5,
        optionsLayout: 7,
      });
    });

    it('should update only triggerLayout', () => {
      const menus = new Map([['menu1', {
        name: 'menu1',
        instance: menu1,
        triggerLayout: 5,
        optionsLayout: 6,
      }]]);
      const registry = makeMenuRegistry(menus);
      registry.updateLayoutInfo('menu1', { triggerLayout: 7 });
      expect(registry.getMenu('menu1')).to.eql({
        name: 'menu1',
        instance: menu1,
        triggerLayout: 7,
        optionsLayout: 6,
      });
    });

    it('should invalidate triggerLayout', () => {
      const menus = new Map([['menu1', {
        name: 'menu1',
        instance: menu1,
        triggerLayout: 5,
      }]]);
      const registry = makeMenuRegistry(menus);
      registry.updateLayoutInfo('menu1', { triggerLayout: undefined });
      expect(registry.getMenu('menu1')).to.eql({
        name: 'menu1',
        instance: menu1,
        triggerLayout: undefined,
      });
    });

  });

  describe('getAll', () => {
    it('should return all registered menus with its associated data', () => {
      const menus = new Map([
        ['menu1', {name: 'menu1', instance: menu1}],
        ['menu2', {name: 'menu2', instance: menu2, triggerLayout: 5}]
      ]);
      const registry = makeMenuRegistry(menus);
      const allMenus = registry.getAll();
      expect(allMenus.length).to.eql(2);
      expect(allMenus).to.contain({name: 'menu1', instance: menu1});
      expect(allMenus).to.contain({name: 'menu2', instance: menu2, triggerLayout: 5});
    });
  });

});
