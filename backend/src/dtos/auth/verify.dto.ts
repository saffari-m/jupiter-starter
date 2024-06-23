import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class VerifyDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  public mobile: string = '';
  
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(8)
  public token: string = '';


}

