/**
 * Created by Ivan Prodaiko on 13-Aug-17.
 */

'use strict';

const { expect } = require('chai');

const Module = require('../src/module');
const Injector = require('../src/injector');

describe('Module', () => {
  describe('creates module', () => {
    const moduleConfig = {
      name: 'testModule',
      declarations: [
        { name: 'dependency', strategy: 'constant',  value: 321 },
        { name: 'localDependency', strategy: 'value', value: { isLocal: true } }
      ],
      exports: ['dependency']
    };

    it('creates instance of module', () => {
      const module = Module.createModule(moduleConfig);
      expect(module).to.be.an.instanceOf(Module);
    });

    it('has own injector', () => {
      const module = Module.createModule(moduleConfig);
      expect(module.injector).to.be.an.instanceOf(Injector);
      expect(module.injector.belongTo).to.be.equal('testModule');
    });

    it('exports dependencies', () => {
      const module = Module.createModule(moduleConfig);
      expect(module.exports).to.be.an.instanceOf(Map);
      expect(module.exports).to.have.property('size', 1);
    });

    it('imports dependencies', () => {
      const module = Module.createModule({
        name: 'SharedModule',
        declarations: [
          { name: 'val', strategy: 'value', value: 123 }
        ],
        imports: [  Module.createModule(moduleConfig) ],
        exports: '*'
      });
      expect(module.exports).to.be.an.instanceOf(Map);
      expect(module.exports).to.have.property('size', 2);
      expect(module.injector.resolve('dependency')).to.equal(321);
      expect(() => {
        module.injector.resolve('localDependency');
      }).to.throw(ReferenceError);
    });
  });
});
