export const buildPublicToken = (moduleName: string, token: string) => {
  return `${moduleName}/${token}`;
};
