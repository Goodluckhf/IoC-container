import EError from 'eerror';

const RequiredAutoFactoryDefinitionError = EError.prepare({
  name: 'RequiredAutoFactoryDefinitionError',
  message: 'You must define in manifest this dependency as autoFactory',
});

export { RequiredAutoFactoryDefinitionError };
