import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  public mobile: string = '';

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  public password: string = '';

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
