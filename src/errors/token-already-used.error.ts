import EError from 'eerror';

const TokenAlreadyUsedError = EError.prepare({
  name: 'TokenAlreadyUsedError',
  message: 'This token has already being used in this context',
});

export { TokenAlreadyUsedError };
