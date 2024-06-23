import { TokenData } from '@interfaces/auth.interface';
import speakeasy from 'speakeasy';

export const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

export const verifyOTPToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({ secret: secret, encoding: 'base32', token: token });
};

export const getSecret = (): string => {
  const secretObj = speakeasy.generateSecret({ length: 20 });
  return secretObj.base32;
};
