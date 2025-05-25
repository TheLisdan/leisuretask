import { omit as lodashOmit } from 'lodash';

export const omit = <TObject extends Object, TKeys extends keyof TObject>(
  object: TObject,
  keys: TKeys[]
): Omit<TObject, TKeys> => {
  return lodashOmit(object, keys);
};
