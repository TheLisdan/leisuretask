import { pick as lodashPick } from 'lodash';

export const pick = <TObject extends Object, TKeys extends keyof TObject>(
  object: TObject,
  keys: TKeys[]
): Pick<TObject, TKeys> => {
  return lodashPick(object, keys);
};
