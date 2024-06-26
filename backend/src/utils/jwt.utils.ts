import { SECRET_KEY, TOKEN_EXPIRE_TIME } from '@config';
import { TokenData } from '@interfaces/auth.interface';
import { sign } from 'jsonwebtoken';

export const createToken = (userId: string): TokenData => {
  const expiresIn: number = parseInt(TOKEN_EXPIRE_TIME?.toString() || '60');
  return { expiresIn, token: sign({ userId }, SECRET_KEY as string, { expiresIn }) };
};
