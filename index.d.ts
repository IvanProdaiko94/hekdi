import * as Application from 'koa';
import * as Router from 'koa-router';

declare interface DependencyConfig {
    name: string,
    strategy: 'service' | 'factory' | 'singleton' | 'value' | 'constant' | 'alias',
    value: any
}

declare class Injector {
    constructor(module: Module)
    resolve(dependencyName: string): any
    addImports(dependencies: any)
    register(...dependencies: DependencyConfig[])
    getConfigOf(dependencyName: string): DependencyConfig
}

declare interface ModuleConfig {
    name: string,
    declarations?: DependencyConfig[],
    imports?: Module[],
    exports?: string | string[]
}

declare class Module {
    constructor(config: Module)
    static createModule(config: ModuleConfig): Module
}

declare class DI {
    constructor();
    module(config: Module | ModuleConfig): Module
    bootstrap(config: Module | ModuleConfig)
    resolve(dependencyName: string): any
    static create(): DI
    static integrateWith(app: any): any
}

export function koaDI(bootstrapModule: Module | ModuleConfig, app: Application, router?: Router): undefined
export function createModule(config: ModuleConfig): Module