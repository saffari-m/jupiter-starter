import { UserDTO } from '@/dtos/users/users.dto';
import { User } from '@/interfaces/users.interface';

export const UserModeltoDTO = (user: User): UserDTO => {
  if (user === null || typeof user === 'undefined') throw 'The user argument is required';
  const { id, name, lastName } = user;
  return new UserDTO(id, name, lastName);
};
export const UserDTOtoModel = (userDto: UserDTO): User => {
  if (userDto === null || typeof userDto === 'undefined') throw 'The user argument is required';
  const { id, name, lastName } = userDto;
  const userModel: User = {
    id,
    name,
    lastName,
    password: '',
    mobile: '',
    secret: '',
    hasTwoFactor: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return userModel;
};
