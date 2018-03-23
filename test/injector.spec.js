'use strict';

const { expect } = require('chai');
const Injector = require('../src/injector');
const Module = require('../src/module');

describe('injector', () => {
  describe('register dependency', () => {
    let injector;
    beforeEach(() => {
      injector = new Injector('MOCK');
    });

    function Dependency1() {
      this.name = 'Dependency1';
      return 'Factory';
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

      it('is service', () => {
        injector.register(
          { name: 'D1', strategy: 'service', value: Dependency1 }
        );
        const ref1 = injector.resolve('D1');
        const ref2 = injector.resolve('D1');
        expect(ref1).to.not.equal(ref2);
        expect(ref1).to.be.a('object');
      });

      it('is factory', () => {
        injector.register(
          { name: 'D1', strategy: 'factory', value: Dependency1 }
        );
        const name = injector.resolve('D1');
        expect(name).to.be.a('string');
        expect(name).to.equal('Factory');
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
          { name: 'dependency', strategy: 'service',  value: Dependency1 }
        ],
        exports: '*'
      });
      injector.addImports(module.exports);
      expect(injector.getConfigOf('dependency')).to.be.an('object');
    });
  });

  describe('self|circular dependency', () => {

    it('not accept self dependency', () => {
      const main = Module.createModule({
        name: 'MainModule',
        declarations: [
          { name: 'A', strategy: 'singleton', value: class A { static get $inject() { return ['A']; } } }
        ],
        exports: '*'
      });
      expect(() => main.injector.resolve('A')).to.throw(Error, /MainModule: A -> A/);
    });

    it('not accept simple circular dependency', () => {
      const main = Module.createModule({
        name: 'MainModule',
        declarations: [
          { name: 'A', strategy: 'singleton', value: class A { static get $inject() { return ['B']; } } },
          { name: 'B', strategy: 'singleton', value: class B { static get $inject() { return ['A']; } } }
        ],
        exports: '*'
      });
      expect(() => main.injector.resolve('A')).to.throw(Error, /MainModule: A -> B -> A/);
    });

    it('not accept complex circular dependency', () => {
      const main = Module.createModule({
        name: 'MainModule',
        declarations: [
          { name: 'A', strategy: 'singleton', value: class A { static get $inject() { return ['B']; } } },
          { name: 'B', strategy: 'singleton', value: class B { static get $inject() { return ['C']; } } },
          { name: 'C', strategy: 'singleton', value: class C { static get $inject() { return ['A']; } } }
        ],
        exports: '*'
      });
      expect(() => main.injector.resolve('A')).to.throw(Error, /MainModule: A -> B -> C -> A/);
    });

    it('create correct error for process', () => {
      const main = Module.createModule({
        name: 'MainModule',
        declarations: [
          { name: 'A', strategy: 'singleton', value: class A { static get $inject() { return ['B']; } } },
          { name: 'B', strategy: 'singleton', value: class B { static get $inject() { return ['D', 'C']; } } },
          { name: 'C', strategy: 'singleton', value: class C { static get $inject() { return ['A']; } } },
          { name: 'D', strategy: 'singleton', value: class D { static get $inject() { return []; } } }
        ],
        exports: '*'
      });
      expect(() => main.injector.resolve('A')).to.throw(Error, /A -> B -> C -> A/);
    });

    it('create correct error while resolving circular dependencies in different modules', () => {
      const toBeImported = Module.createModule({
        name: 'XModule',
        declarations: [
          { name: 'C', strategy: 'service',  value: class C { static get $inject() { return ['D']; } } },
          { name: 'D', strategy: 'service',  value: class D { static get $inject() { return ['E']; } } },
          { name: 'E', strategy: 'service',  value: class E { static get $inject() { return ['F']; } } },
          { name: 'F', strategy: 'service',  value: class F { static get $inject() { return ['C']; } } },
        ],
        exports: ['C', 'D']
      });

      const main = Module.createModule({
        name: 'YModule',
        declarations: [
          { name: 'A', strategy: 'service',  value: class A { static get $inject() { return ['B']; } } },
          { name: 'B', strategy: 'service',  value: class B { static get $inject() { return ['C', 'D']; } } }
        ],
        imports: [ toBeImported ],
        exports: '*'
      });

      expect(() => main.injector.resolve('A')).to.throw(Error, /XModule: C -> D -> E -> F -> C/);
    });


    it('circular dependency through several modules', () => {
      const x = Module.createModule({
        name: 'Module X',
        declarations: [
          { name: 'G', strategy: 'service',  value: class C { static get $inject() { return ['OK', 'Good', 'H']; } } },
          { name: 'H', strategy: 'service',  value: class D { static get $inject() { return ['I']; } } },
          { name: 'I', strategy: 'service',  value: class E { static get $inject() { return ['J']; } } },
          { name: 'J', strategy: 'service',  value: class F { static get $inject() { return ['G']; } } },
          { name: 'OK', strategy: 'constant', value: 123 },
          { name: 'Good', strategy: 'singleton', value: class Good { } },
        ],
        exports: ['G']
      });

      const y = Module.createModule({
        name: 'Module Y',
        declarations: [
          { name: 'C', strategy: 'service',  value: class C { static get $inject() { return ['D']; } } },
          { name: 'D', strategy: 'service',  value: class D { static get $inject() { return ['E']; } } },
          { name: 'E', strategy: 'service',  value: class E { static get $inject() { return ['F']; } } },
          { name: 'F', strategy: 'service',  value: class F { static get $inject() { return ['G']; } } }
        ],
        imports: [ x ],
        exports: ['C', 'D']
      });

      const z = Module.createModule({
        name: 'Module Z',
        declarations: [
          { name: 'A', strategy: 'service',  value: class A { static get $inject() { return ['B']; } } },
          { name: 'B', strategy: 'service',  value: class B { static get $inject() { return ['C', 'D']; } } }
        ],
        imports: [ y ],
        exports: '*'
      });
      expect(() => z.injector.resolve('A')).to.throw(Error, /Module X: G -> H -> I -> J -> G/);
    });
  });
});
