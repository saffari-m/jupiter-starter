import { User } from '@/interfaces/users.interface';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsBoolean, IsStrongPassword } from 'class-validator';

export class UserDTO {
  constructor(id: string, name: string | null, lastName: string | null) {
    this.id = id;
    this.name = name || '';
    this.lastName = lastName || '';
  }
  @IsString()
  @IsNotEmpty()
  public id: string = '';
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  public name: string = '';
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  public lastName: string = '';
}