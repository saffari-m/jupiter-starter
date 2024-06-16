import { Response } from 'express';
import { Controller, Req, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers';
import { Container } from 'typedi';
import { UserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthService } from '@services/auth.service';
import { VerifyDto } from '@/dtos/verify.dto';

@Controller()
export class AuthController {
  public auth = Container.get(AuthService);

  @Post('/signup')
  @UseBefore(ValidationMiddleware(UserDto))
  @HttpCode(201)
  async signUp(@Body() userData: UserDto) {
    const signUpUserData: User = await this.auth.signup(userData);
    return { data: signUpUserData, message: 'signup' };
  }

  @Post('/login')
  @UseBefore(ValidationMiddleware(UserDto))
  async logIn(@Res() res: Response, @Body() userData: UserDto) {
    const { cookie, user } = await this.auth.login(userData);

    res.setHeader('Set-Cookie', [cookie]);
    return { data: user, message: 'login' };
  }
  @Post('/verify')
  @UseBefore(ValidationMiddleware(VerifyDto))
  async verify(@Res() res: Response, @Body() verifyData: VerifyDto) {
    const { cookie, user } = await this.auth.loginWithToken(verifyData);

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
