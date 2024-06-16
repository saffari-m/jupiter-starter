import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { UserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserModel } from '@models/users.model';
import { VerifyDto } from '@/dtos/verify.dto';
import VerifiedUserModel from '@/models/verifiedUser.model';
import { UserService } from './users.service';
import speakeasy from 'speakeasy';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY as string, { expiresIn }) };
};
const verifyOTPToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({ secret: secret, encoding: 'base32', token: token });
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  public userService = Container.get(UserService);
  public async signup(userData: UserDto): Promise<User> {
    const findUser: User = await this.userService.findUserByMobileNumber(userData.mobile);
    if (findUser) throw new HttpException(409, `This mobile ${userData.mobile} already exists`);

    const createUserData: User = (await this.userService.createUser(userData)) as User;

    return createUserData;
  }

  public async login(userData: UserDto): Promise<VerifiedUserModel> {
    const findUser: User = await this.userService.findUserByMobileNumber(userData.mobile);
    if (!findUser) throw new HttpException(409, `This mobile ${userData.mobile} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return new VerifiedUserModel(cookie, findUser);
  }
  public async loginWithToken(verifyDto: VerifyDto): Promise<VerifiedUserModel> {
    const findUser: User = await this.userService.findUserByMobileNumber(verifyDto.mobile);
    if (!findUser) throw new HttpException(409, `This mobile ${verifyDto.mobile} was not found`);

    if (!verifyOTPToken(verifyDto.token, findUser.secret)) throw new HttpException(409, `This token ${verifyDto.token} was invalid`);

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);
    return new VerifiedUserModel(cookie, findUser);
  }
  // public async logout(userData: User): Promise<User> {
  //   const findUser: User = UserModel.find(user => user.email === userData.email && user.password === userData.password);
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   return findUser;
  // }
}
