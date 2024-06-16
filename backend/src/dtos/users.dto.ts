import { IsString, IsNotEmpty, MinLength, MaxLength, IsBoolean, IsStrongPassword } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  public mobile: string = '';
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
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  public password: string = '';
  @IsBoolean()
  public hasTwoFactor: boolean = false;
}
