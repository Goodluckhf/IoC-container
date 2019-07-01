import EError from 'eerror';

const ValidationError = EError.prepare({
  name: 'ValidationError',
  message: 'Validation error during parse input manifest',
});

export { ValidationError };
