import EError from 'eerror';

const AlreadyCompiledError = EError.prepare({
  name: 'AlreadyCompiledError',
  message: 'IoCContainer must be compile only once',
});

export { AlreadyCompiledError };
