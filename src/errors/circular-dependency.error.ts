import EError from 'eerror';

const CircularDependencyError = EError.prepare({
  name: 'CircularDependencyError',
  message: 'Circular dependency error',
});

export { CircularDependencyError };
