import { expect } from 'chai';

jest.dontMock('../src/helpers');
const {
  measure,
  makeName,
  computeContextMenuPosition,
  computePositionOutside
} = require('../src/helpers');

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

  describe('computeContextMenuPosition', () => {

    it('should returns default-top-left position', () => {
      const window = { width: 400, height: 600 };
      const trigger = { width: 50, height: 50, x: 100, y: 100 };
      const options = { width: 50, height: 50 };
      expect(computeContextMenuPosition(window, trigger, options)).to.eql({
        top: 100, left: 100
      });
    });

    it('should returns top-left position', () => {
      const window = { width: 400, height: 600 };
      const trigger = { width: 50, height: 50, x: 10, y: 10 };
      const options = { width: 50, height: 50 };
      expect(computeContextMenuPosition(window, trigger, options)).to.eql({
        top: 10, left: 10
      });
    });

    it('should returns top-right position', () => {
      const window = { width: 400, height: 600 };
      const trigger = { width: 100, height: 50, x: 300, y: 0 };
      const options = { width: 150, height: 100 };
      expect(computeContextMenuPosition(window, trigger, options)).to.eql({
        top: 0, left: 250
      });
    });

    it('should returns bottom-left position', () => {
      const window = { width: 400, height: 600 };
      const trigger = { width: 100, height: 100, x: 10, y: 500 };
      const options = { width: 150, height: 150 };
      expect(computeContextMenuPosition(window, trigger, options)).to.eql({
        top: 450, left: 10
      });
    });

    it('should returns bottom-right position', () => {
      const window = { width: 400, height: 600 };
      const trigger = { width: 100, height: 100, x: 300, y: 500 };
      const options = { width: 150, height: 150 };
      expect(computeContextMenuPosition(window, trigger, options)).to.eql({
        top: 450, left: 250
      });
    });

  });

  describe('computePositionOutside', () => {
    it('should compute position outside of the screen', () => {
      const window = { width: 400, height: 600 };
      expect(computePositionOutside(window)).to.eql({
        top: 600, left: 400
      });
    });
  });

});
