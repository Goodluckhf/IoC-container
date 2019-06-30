# IoC-container
Declarative and simple IoC container for node.js applications

![Travis](https://img.shields.io/travis/Goodluckhf/IoC-container/master.svg?style=flat-square)
[![Coverage Status](https://coveralls.io/repos/github/Goodluckhf/IoC-container/badge.svg?branch=master)](https://coveralls.io/github/Goodluckhf/IoC-container?branch=master)
![node](https://img.shields.io/node/v/@ukitgroup/ioc.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/@ukitgroup/ioc.svg?style=flat-square)

![GitHub top language](https://img.shields.io/github/languages/top/Goodluckhf/IoC-container.svg?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Goodluckhf/IoC-container.svg?style=flat-square)
![David](https://img.shields.io/david/Goodluckhf/IoC-container.svg?style=flat-square)
![David](https://img.shields.io/david/dev/Goodluckhf/IoC-container.svg?style=flat-square)

![license](https://img.shields.io/github/license/Goodluckhf/IoC-container.svg?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Goodluckhf/IoC-container.svg?style=flat-square)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)

### Usage
```javascript
import {Container} from '@ukitgroup/ioc';

class ServiceA {}

// First of all you have to define DI config:
const diManifest = {
 moduleName: 'module',
 providers: [
   {
	 isPublic: true,
	 token: 'serviceA',
	 useClass: ServiceA,
   },
 ],
};


// Then in your composition root just create container
Container.loadManifests([diManifest]);
Container.compile();
```

#### Provider types
You can provide by concrete realization with several ways:
```javascript
class ServiceA {
  constructor(serviceB) {
   this.serviceB = serviceB;
  }
}

// Dependencies will be resolved and injected to instance automatically
const providerByClass = {
	token: 'serviceA',
	useClass: ServiceA,
	dependencies: ['ServiceB']
};

// You can provide constant value
const providerByValue = {
	token: 'connectionUri',
	useValue: 'mongodb://uri',
};

// You can provide by factory function
// Also resolved dependencies will be resolved automatically
const providerByFactory = {
	token: 'connectionUri',
	useFactory: (serviceB) => {
	  return new ServiceA(serviceB)
	},
	dependencies: ['ServiceB']
};
```

### Public/Private scope

By default all providers define in `private` scope.
If you want to use provider from another module you should define this provider as `public`
```javascript
const moduleAManifest = {
  moduleName: 'moduleA',
  providers: [
	{
	  isPublic: true,
	  token: 'ServiceA',
	  useClass: ServiceA,
	},
  ],
};

const moduleBManifest = {
  moduleName: 'moduleB',
  providers: [
	{
	  isPublic: true,
	  token: 'ServiceC',
	  useClass: ServiceC,
	  dependencies: [
		// You should define which module this provider from
		['ServiceA', { fromModule: 'moduleA' }],
	  ],
	},
  ],
};
```

### Class Factory (AutoFactory)
There some cases when you want create instances in code i.e: Entities, Command pattern https://en.wikipedia.org/wiki/Command_pattern

It's very simple if your class doesn't have dependencies so you can create instance just in you code:
```javascript
class Entity {
  constructor(name) {
    this.name = name;
  }
}

class Example {
  doSomething() {
    const a = new Entity('test');
    // ...
  }
}
```
But there are some cases when this class has dependencies and you can't just create object because you have to transmit resolved provider.
But we can follow `js way` :)
```javascript
class Entity {
  constructor(service, name) {
    this.service = service;
    this.name = name;
  }
}

class Example {
  constructor(Entity) {
    this.Entity = Entity;
  }
  
  doSomething() {
    // Now you still have to provide rest arguments
    // And all dependencies has already resolved
    const a = new Entity('test');
    // ...
  }
}

const moduleManifest = {
  moduleName: 'moduleB',
	providers: [
	  {
		isPublic: true,
		token: 'Entity',
		useClass: Entity,
		dependencies: [
		  // You should define which module this provider from
		  ['ServiceA', { autoFactory: true }],
		],
	  },
	  {
	    token: 'ServiceA',
	    // To make it clear you should define in both "autoFactory: true"
	    autoFactory: true,
	    useClass: ServiceA,
	  }
	],
}
```
