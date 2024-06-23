import { UserDTO } from "@/dtos/users/users.dto";

export class UserCreateResponseDTO {
  cookie: string = '';
  user: UserDTO;
  constructor(cookie: string, user: UserDTO) {
    this.cookie = cookie;
    this.user = user;
  }
}
