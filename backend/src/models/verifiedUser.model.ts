import { User } from '@/interfaces/users.interface';

export default class VerifiedUserModel {
  cookie: string = '';
  user: User | undefined;
  constructor(cookie: string, user: User) {
    this.cookie = cookie;
    this.user = user;
  }
}
