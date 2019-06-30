import EError from 'eerror';

const NotFoundProviderDefinitionError = EError.prepare({
  name: 'NotFoundProviderDefinitionError',
  message:
    "Cannot find provider. You didn't define provider in manifest or try use private provider from different module",
});

export { NotFoundProviderDefinitionError };
