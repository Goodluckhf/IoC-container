import EError from 'eerror';

const NotCompiledError = EError.prepare({
  name: 'NotCompiledError',
  message: 'You probably forgot to invoke container.compile()',
});

export { NotCompiledError };
