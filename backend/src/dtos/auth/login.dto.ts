import { IsString, IsNotEmpty, MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  public mobile: string = '';
  
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  public password: string = '';


}

