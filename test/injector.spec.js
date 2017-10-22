'use strict';

const { expect } = require('chai');
const Injector = require('../src/injector');
const Module = require('../src/module');

describe('injector', () => {
  let injector;
  beforeEach(() => {
    injector = new Injector('MOCK');
  });
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
      injector.register(
        { name: 'D1', strategy: 'singleton', value: Dependency1 },
        { name: 'D2', strategy: 'singleton', value: Dependency2 }
      );

      const instance = injector.resolve('D2');
      expect(instance).to.be.an.instanceOf(Dependency2);
    });

    describe('strategies test', () => {

      it('is singleton', () => {
        injector.register(
          { name: 'D1', strategy: 'singleton', value: Dependency1 }
        );

        const ref1 = injector.resolve('D1');
        const ref2 = injector.resolve('D1');
        expect(ref1).to.deep.equal(ref2);
      });

      it('is factory', () => {
        injector.register(
          { name: 'D1', strategy: 'factory', value: Dependency1 }
        );

        const ref1 = injector.resolve('D1');
        const ref2 = injector.resolve('D1');
        expect(ref1).to.not.equal(ref2);
      });

      it('is value', () => {
        injector.register(
          { name: 'D1', strategy: 'value', value: '123' }
        );

        const d1 = injector.resolve('D1');
        expect(d1).to.equal('123');
      });

      it('is constant', () => {
        injector.register(
          { name: 'D1', strategy: 'constant', value: '123' }
        );
        const d1 = injector.resolve('D1');
        expect(d1).to.equal('123');
        expect(() => {
          injector.register(
            { name: 'D1', strategy: 'value', value: '12' }
          );
        }).to.throw(Error);
      });

      it('is alias', () => {
        injector.register(
          { name: 'D1', strategy: 'singleton', value: Dependency1 },
          { name: 'Alias', strategy: 'alias', value: 'D1' }
        );
        const d1 = injector.resolve('Alias');
        expect(d1).to.to.be.an.instanceOf(Dependency1);
      });

      describe('provider', () => {
        it('register provider', () => {
          class Y { }
          class X {
            static get $inject() {
              return ['Y'];
            }
            constructor(y) {
              expect(y).to.be.an.instanceOf(Y);
            }
          }
          injector.register(
            { name: 'X', strategy: 'provider', value: () => ({ name: 'X', strategy: 'factory', value: X }) },
            { name: 'TestProvider', strategy: 'provider', value: () => ({ name: 'Y', strategy: 'factory', value: Y }) }
          );
          const x = injector.resolve('X');
          const y = injector.resolve('X');
          expect(x).to.be.an.instanceOf(X);
          expect(x).to.not.equal(y);
          expect(injector.resolve('Y')).to.be.an.instanceOf(Y);
        });
        it('throws an error if provider returns provider', () => {
          expect(() => {
            injector.register(
              { name: 'X', strategy: 'provider', value: () => ({ strategy: 'provider', value: 'V' }) }
            );
          }).to.throw(Error);
        });
      });

      it('is unknown strategy', () => {
        expect(() => {
          injector.register({ name: 'D1', strategy: 'blablabla', value: Dependency1 });
        }).to.throw(Error);
      });
    });

    it('imports dependencies from other modules', () => {
      const module = Module.createModule({
        name: 'AnotherModule',
        declarations: [
          { name: 'dependency', strategy: 'factory',  value: Dependency1 }
        ],
        exports: '*'
      });
      injector.addImports(module.exports);
      expect(injector.getConfigOf('dependency')).to.be.an('object');
    });
  });

  describe('self|circular dependency', () => {

    it('not accept self dependency', () => {
      class A {
        static get $inject() {
          return ['A'];
        }
      }
      injector.register(
        { name: 'A', strategy: 'singleton', value: A }
      );
      expect(() => injector.resolve('A')).to.throw(Error, /A: A -> A/);
    });

    it('not accept simple circular dependency', () => {
      class A {
        static get $inject() {
          return ['B'];
        }
      }

      class B {
        static get $inject() {
          return ['A'];
        }
      }
      injector.register(
        { name: 'A', strategy: 'singleton', value: A },
        { name: 'B', strategy: 'singleton', value: B }
      );
      expect(() => injector.resolve('A')).to.throw(Error, /A: A -> B -> A/);
    });

    it('not accept complex circular dependency', () => {
      class A {
        static get $inject() {
          return ['B'];
        }
      }

      class B {
        static get $inject() {
          return ['C'];
        }
      }

      class C {
        static get $inject() {
          return ['A'];
        }
      }
      injector.register(
        { name: 'A', strategy: 'singleton', value: A },
        { name: 'B', strategy: 'singleton', value: B },
        { name: 'C', strategy: 'singleton', value: C }
      );
      expect(() => injector.resolve('A')).to.throw(Error, /A: A -> B -> C -> A/);
    });

    it('create correct error for process', () => {
      class A {
        static get $inject() {
          return ['B'];
        }
      }

      class B {
        static get $inject() {
          return ['D', 'C'];
        }
      }

      class C {
        static get $inject() {
          return ['A'];
        }
      }

      class D {
        static get $inject() {
          return [];
        }
      }
      injector.register(
        { name: 'A', strategy: 'singleton', value: A },
        { name: 'B', strategy: 'singleton', value: B },
        { name: 'C', strategy: 'singleton', value: C },
        { name: 'D', strategy: 'singleton', value: D }
      );
      expect(() => injector.resolve('A')).to.throw(Error, /A: A -> B -> C -> A/);
    });
  });
});
