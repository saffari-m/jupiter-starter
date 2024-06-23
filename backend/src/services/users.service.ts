import { db } from '@/db';
import { users } from '@/db/schema/users';
import { HttpException } from '@exceptions/httpException';
import { NewUser, User } from '@interfaces/users.interface';
import { eq } from 'drizzle-orm';
import Container, { Service } from 'typedi';
import { UserCreateDTO } from '@/dtos/users/usersCreate.dto';
import { UserModeltoDTO } from '@/mappings/user.mapper';
import { UserDTO } from '@/dtos/users/users.dto';
import { hashPassword } from '@/utils/password.utils';
import { getSecret } from '@/utils/auth.utils';
import { UserRepository } from '@/repositories/user.repository';

@Service()
export class UserService {
  private userRepository = Container.get(UserRepository);

  public async findAllUser(limit: number = 10, offset: number = 0): Promise<User[]> {
    return await this.userRepository.getList(offset, limit);
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser = await this.userRepository.getById(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
  public async findUserByMobileNumber(mobile: string): Promise<User> {
    const findUser = await this.userRepository.getByMobile(mobile);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userCreateDTO: UserCreateDTO): Promise<UserDTO> {
    const findUser = await this.userRepository.getByMobile(userCreateDTO.mobile);
    // db.query.users.findFirst({
    //   where: eq(users.mobile, userData.mobile),
    // });
    if (findUser) throw new HttpException(409, `This phone number ${userCreateDTO.mobile} already exists`);

    const userValues: NewUser = { ...userCreateDTO, secret: '' };
    userValues.password = await hashPassword(userCreateDTO.password);
    userValues.secret = getSecret();
    const createdUser = await this.userRepository.create(userValues);

    return UserModeltoDTO(createdUser);
  }

  // public async updateUser(userId: string, userData: UserDto): Promise<User[]> {
  //   const findUser = db.select().from(users).where(eq(users.id, userId));
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   const hashedPassword = await hash(userData.password, 10);
  //   const updateUserData: User[] = UserModel.map((user: User) => {
  //     if (user.id === findUser.id) user = { id: userId, ...userData, password: hashedPassword };
  //     return user;
  //   });

  //   return updateUserData;
  // }

  public async deleteUser(userId: string): Promise<User[]> {
    const deletedUser = await db.delete(users).where(eq(users.id, userId)).returning();
    if (!deletedUser) throw new HttpException(409, "User doesn't exist");
    return deletedUser;
  }
}
