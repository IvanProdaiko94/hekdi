'use strict';

const { expect } = require('chai');

const Injector = require('../../src/injector');

describe('injector', () => {
  describe('register dependency', () => {

    class Dependency1 {
      constructor() {
        this.name = 'Dependency1';
      }
    }

    class Dependency2 {
      static get $inject() {
        return ['D1'];
      }

      constructor(d1) {
        this.name = 'Dependency2';
        this.d1 = d1;
      }
    }

    it('basic usage', () => {
      const injector = new Injector('MOCK');
      injector.register([
        { name: 'D1', strategy: 'singleton', value: Dependency1 },
        { name: 'D2', strategy: 'singleton', value: Dependency2 }
      ]);

      const instance = injector.resolve('D2');
      expect(instance).to.be.an.instanceOf(Dependency2);
    });

    describe('strategies test', () => {

      it('is singleton', () => {
        const injector = new Injector('MOCK');
        injector.register([
          { name: 'D1', strategy: 'singleton', value: Dependency1 }
        ]);

        const ref1 = injector.resolve('D1');
        const ref2 = injector.resolve('D1');

        expect(ref1).to.deep.equal(ref2);
      })
    })
  });
});
