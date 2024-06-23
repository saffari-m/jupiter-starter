import { db } from '@/db';
import { users } from '@/db/schema';
import { UserCreateDTO } from '@/dtos/users/usersCreate.dto';
import { IRepository } from '@/interfaces/repository.interface';
import { NewUser, User } from '@/interfaces/users.interface';
import { isNullOrUndefined } from '@/utils/common.utils';
import { eq } from 'drizzle-orm';
import { query } from 'express';
import { Service } from 'typedi';

@Service()
export class UserRepository implements IRepository<User, NewUser> {
  async getById(id: string): Promise<User> {
    if (isNullOrUndefined(id)) throw new Error('User id is required.');
    const findUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return findUser as User;
  }
  async getList(offset: number, limit: number): Promise<User[]> {
    if (isNullOrUndefined(offset)) throw new Error('offset is required.');
    if (isNullOrUndefined(limit)) throw new Error('limit is required.');

    const userList = await db.select().from(users).limit(limit).offset(offset);
    return userList;
  }
  async getByMobile(mobileNumber: string): Promise<User> {
    if (isNullOrUndefined(mobileNumber)) throw new Error('mobileNumber is required.');
    const findUser = await db.query.users.findFirst({ where: eq(users.mobile, mobileNumber) });

    return findUser as User;
  }
  async create(data: NewUser): Promise<User> {
    if (isNullOrUndefined(data)) throw new Error('User data is required.');

    return await db
      .insert(users)
      .values(data)
      .returning()
      .then(result => result[0]);
  }
  async update(data: NewUser): Promise<User> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
