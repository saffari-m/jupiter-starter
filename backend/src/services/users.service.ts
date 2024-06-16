// import { hash } from 'bcrypt';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { UserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/httpException';
import { NewUser, User } from '@interfaces/users.interface';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { Service } from 'typedi';
import speakeasy from 'speakeasy';
const getSecret = (): string => {
  const secretObj = speakeasy.generateSecret({ length: 20 });
  console.log(secretObj);
  return secretObj.base32;
};

@Service()
export class UserService {
  public async findAllUser(limit: number = 10, offset: number = 0): Promise<User[]> {
    const userList = db.select().from(users).limit(limit).offset(offset);
    return userList;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser = await db.select().from(users).where(eq(users.id, userId));
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser[0];
  }
  public async findUserByMobileNumber(mobile: string): Promise<User> {
    const findUser = await db.select().from(users).where(eq(users.mobile, mobile));
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser[0];
  }

  public async createUser(userData: UserDto): Promise<NewUser> {
    const findUser = await db.query.users.findFirst({
      where: eq(users.mobile, userData.mobile),
    });
    if (findUser) throw new HttpException(409, `This phone number ${userData.mobile} already exists`);

    const userValues: NewUser = { ...userData, secret: '' };
    userValues.password = await hash(userData.password, 10);
    userValues.secret = getSecret();

    const createdUser = await db.insert(users).values(userValues).returning();

    return createdUser[0];
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
