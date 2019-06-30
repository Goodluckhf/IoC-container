import EError from 'eerror';

const ModuleHasAlreadyExists = EError.prepare({
  name: 'ModuleHasAlreadyExists',
  message: 'There must be only 1 module with such name',
});

export { ModuleHasAlreadyExists };
