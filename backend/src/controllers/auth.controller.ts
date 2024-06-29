import { Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers';
import { Container } from 'typedi';
// import { RequestWithUser } from '@interfaces/auth.interface';
// import { User } from '@interfaces/users.interface';
// import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthService } from '@services/auth.service';
import { VerifyDTO } from '@/dtos/auth/verify.dto';
import { LoginDTO } from '@/dtos/auth/login.dto';
import { SignupDTO } from '@/dtos/auth/signup.dto';
import { SendOTPDTO } from '@/dtos/auth/send-otp';

@Controller()
export class AuthController {
  public auth = Container.get(AuthService);

  @Post('/signup')
  @UseBefore(ValidationMiddleware(SignupDTO))
  @HttpCode(201)
  async signUp(@Body() signupData: SignupDTO) {
    return { data: await this.auth.signup(signupData), message: 'signup' };
  }

  @Post('/login')
  @UseBefore(ValidationMiddleware(LoginDTO))
  async logIn(@Res() res: Response, @Body() userData: LoginDTO) {
    const { cookie, user } = await this.auth.login(userData);

    res.setHeader('Set-Cookie', [cookie]);
    return { data: user, message: 'login' };
  }
  @Post('/otp')
  @UseBefore(ValidationMiddleware(SendOTPDTO))
  async sendOTP(@Res() res: Response, @Body() verifyData: SendOTPDTO) {
    const otpToken = await this.auth.sendOTPToken(verifyData);
    return { data: { token: otpToken }, message: 'OTP' };
  }
  @Post('/verify')
  @UseBefore(ValidationMiddleware(VerifyDTO))
  async verify(@Res() res: Response, @Body() verifyData: VerifyDTO) {
    const { cookie, user } = await this.auth.loginWithOTPToken(verifyData);

    res.setHeader('Set-Cookie', [cookie]);
    return { data: user, message: 'login' };
  }

  // @Post('/logout')
  // @UseBefore(AuthMiddleware)
  // async logOut(@Req() req: RequestWithUser, @Res() res: Response) {
  //   const userData: User = req.user;
  //   const logOutUserData: User = await this.auth.logout(userData);

  //   res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
  //   return { data: logOutUserData, message: 'logout' };
  // }
}
