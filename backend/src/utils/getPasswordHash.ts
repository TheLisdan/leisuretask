import crypto from 'crypto';

export const getPasswordHash = (password: string) => {
  const passwordHash = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
  return passwordHash;
};
