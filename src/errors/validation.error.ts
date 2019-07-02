import EError from 'eerror';

const ValidationError = EError.prepare({
  name: 'ValidationError',
  message: 'Validation error during transform input manifest',
});

export { ValidationError };
