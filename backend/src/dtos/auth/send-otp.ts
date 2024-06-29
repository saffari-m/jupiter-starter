import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SendOTPDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @MaxLength(11)
  public mobile: string = '';

}

