import { TokenData } from '@interfaces/auth.interface';
import speakeasy from 'speakeasy';
import { TOTP_EXPIRE } from '@config';
export const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export const verifyOTPToken = (token: string, secret: string): boolean => {
  const step: number = parseInt(TOTP_EXPIRE?.toString() || '60');
  return speakeasy.totp.verify({ secret: secret, encoding: 'base32', token: token, step });
};
export const generateOTPToken = (secret: string): string => {
  const step: number = parseInt(TOTP_EXPIRE?.toString() || '60');
  return speakeasy.totp({ secret: secret, encoding: 'base32', step });
};

export const getSecret = (): string => {
  const secretObj = speakeasy.generateSecret({ length: 20 });
  return secretObj.base32;
};
