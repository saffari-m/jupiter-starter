import Container, { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { NewUser, User } from '@interfaces/users.interface';
import { VerifyDTO } from '@/dtos/auth/verify.dto';
import { LoginDTO } from '@/dtos/auth/login.dto';
import { SignupDTO } from '@/dtos/auth/signup.dto';
import { UserDTO } from '@/dtos/users/users.dto';
import { UserModeltoDTO } from '@/mappings/user.mapper';
import { UserCreateResponseDTO } from '@/dtos/users/userCreateResponse.dto';
import { createCookie, getSecret, verifyOTPToken } from '@/utils/auth.utils';
import { createToken } from '@/utils/jwt.utils';
import { hashPassword, verifyPassword } from '@/utils/password.utils';
import { UserRepository } from '@/repositories/user.repository';

@Service()
export class AuthService {
  public userRepository = Container.get(UserRepository);

  public async signup(signupData: SignupDTO): Promise<UserDTO> {
    const findUser: User = await this.userRepository.getByMobile(signupData.mobile);
    if (findUser) throw new HttpException(409, `This mobile ${signupData.mobile} already exists`);

    const userValues: NewUser = { ...signupData, secret: '' };
    userValues.password = await hashPassword(userValues.password);
    userValues.secret = getSecret();
    const createdUser = await this.userRepository.create(userValues);
    return UserModeltoDTO(createdUser);
  }

  public async login(userData: LoginDTO): Promise<UserCreateResponseDTO> {
    const findUser: User = await this.userRepository.getByMobile(userData.mobile);
    if (!findUser) throw new HttpException(409, `This mobile ${userData.mobile} was not found`);

    const isPasswordMatching: boolean = await verifyPassword(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = createToken(findUser.id);
    const cookie = createCookie(tokenData);
    return new UserCreateResponseDTO(cookie, UserModeltoDTO(findUser));
  }

  public async loginWithOTPToken(verifyDTO: VerifyDTO): Promise<UserCreateResponseDTO> {
    const findUser: User = await this.userRepository.getByMobile(verifyDTO.mobile);
    if (!findUser) throw new HttpException(409, `This mobile ${verifyDTO.mobile} was not found`);

    if (!verifyOTPToken(verifyDTO.token, findUser.secret)) throw new HttpException(409, `This token ${verifyDTO.token} was invalid`);

    const tokenData = createToken(findUser.id);
    const cookie = createCookie(tokenData);
    return new UserCreateResponseDTO(cookie, UserModeltoDTO(findUser));
  }
  // public async logout(userData: User): Promise<User> {
  //   const findUser: User = UserModel.find(user => user.email === userData.email && user.password === userData.password);
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   return findUser;
  // }
}
