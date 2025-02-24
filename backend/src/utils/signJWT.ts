import jwt from 'jsonwebtoken';
import { env } from '../lib/env';

export const signJWT = (userId: string) => {
  return jwt.sign(userId, env.JWT_SECRET);
};
