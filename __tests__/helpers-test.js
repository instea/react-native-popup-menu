import { expect } from 'chai';
import { TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';

jest.dontMock('../src/helpers');
const { measure, makeName, makeTouchable, lo } = require('../src/helpers');

describe('helpers test', () => {

  describe('measure', () => {

    it('should be a function', () => {
      expect(measure).to.be.a('function');
    });

    it('should promisify measure callback', done => {
      const ref = {
        measure: callback => callback(0, 0, 100, 200, 50, 20)
      };
      measure(ref).then(layout => {
        expect(layout).to.be.an('object');
        expect(layout).to.eql({
          x: 50, y: 20, width: 100, height: 200
        });
        done();
      }).catch((err = 'promise rejected') => done(err));
    });

  });

  describe('makeName', () => {
    it('should be a function', () => {
      expect(makeName).to.be.a('function');
    });

    it('should return unique names', () => {
      const name1 = makeName(),
            name2 = makeName();
      expect(name1).to.be.a('string');
      expect(name2).to.be.a('string');
      expect(name1).not.to.be.equal(name2);
    });
  });

  describe('makeTouchable', () => {

    it('should create TouchableNativeFeedback for android', () => {
      Platform.select.mockImplementationOnce(o => {
        return o.android;
      });
      const { Touchable, defaultTouchableProps } = makeTouchable();
      expect(Touchable).to.be.equal(TouchableNativeFeedback);
      expect(defaultTouchableProps).to.be.an('object');
    });

    it('should create TouchableHighlight for ios', () => {
      Platform.select.mockImplementationOnce(o => {
        return o.ios;
      });
      const { Touchable, defaultTouchableProps } = makeTouchable();
      expect(Touchable).to.be.equal(TouchableHighlight);
      expect(defaultTouchableProps).to.be.an('object');
    });

    it('should return passed component', () => {
      const MyTouchable = () => null;
      const { Touchable, defaultTouchableProps } = makeTouchable(MyTouchable);
      expect(Touchable).to.be.equal(MyTouchable);
      expect(defaultTouchableProps).to.be.an('object');
    });

  });

  describe('lo', () => {

    it('should return primitive unchanged', () => {
      const res = lo(3);
      expect(res).to.be.equal(3);
    });

    it('should return nexted object without private fields unchanged', () => {
      const input = { a: 'ahoj', b : { c : 3, d : { e : 'nested' }}};
      const res = lo(input);
      expect(res).to.be.deep.equal(input);
    });

    it('should strip private fields', () => {
      const res = lo({ a: { _b : "private", c: 3}});
      expect(res).to.be.deep.equal({ a: { c : 3}});
    });

    it('should strip excluded fields', () => {
      const res = lo({ a: { b : "exc", c: 3}}, "b");
      expect(res).to.be.deep.equal({ a: { c : 3}});
    });

  });

});
