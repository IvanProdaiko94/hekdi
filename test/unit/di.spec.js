'use strict';

const { expect } = require('chai');

const DI = require('../../src/di');
const Module = require('../../src/module');

describe('di', () => {
  const di = new DI();

  class Dependency {
    constructor() {
      this.name = 'Dependency';
    }
  }

  const testModuleConfig = {
    name: 'testModule',
    declarations: [
      { name: 'dependency', strategy: 'constant',  value: 132 },
      { name: 'localDependency', strategy: 'value', value: { isLocal: true } }
    ],
    exports: ['dependency']
  };

  it('create module from config', () => {
    const testModule = di.module(testModuleConfig);
    expect(testModule).to.be.an.instanceOf(Module);
  });

  it('bootstraps all modules', () => {
    const testModule = di.module(testModuleConfig);
    di.bootstrap({
      name: 'SharedModule',
      declarations: [
        { name: 'Singleton', strategy: 'singleton', value: Dependency }
      ],
      imports: [ testModule ],
      exports: '*'
    });
    expect(di.main).to.be.an.instanceOf(Module);
  });

  it('resolves dependency', () => {
    const singleton = di.resolve('Singleton');
    const dependency = di.resolve('dependency');
    expect(singleton).to.be.an.instanceOf(Dependency);
    expect(dependency).to.be.equal(132);
    expect(() => {
      di.resolve('localDependency');
    }).to.throw(ReferenceError);
  });
});
