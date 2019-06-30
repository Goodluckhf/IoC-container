import EError from 'eerror';

const AlreadyCompiledError = EError.prepare({
  name: 'AlreadyCompiledError',
  message: 'Container must be compile only once',
});

export { AlreadyCompiledError };
