import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Container } from 'typedi';
import { UserDTO } from '@dtos/users/users.dto';
import { User } from '@interfaces/users.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { UserService } from '@services/users.service';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { UserCreateDTO } from '@/dtos/users/usersCreate.dto';

@Controller()
export class UserController {
  public path = '/users';
  public user = Container.get(UserService);

  @Get('/users')
  @UseBefore(AuthMiddleware)
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers(@Param('limit') limit: number, @Param('offset') offset: number) {
    const findAllUsersData: User[] = await this.user.findAllUser(limit, offset);
    return { data: findAllUsersData, message: 'findAll' };
  }

  @Get('/users/:id')
  @UseBefore(AuthMiddleware)
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById(@Param('id') userId: string) {
    const findOneUserData: User = await this.user.findUserById(userId);
    return { data: findOneUserData, message: 'findOne' };
  }

  @Post('/users')
  @HttpCode(201)
  @UseBefore(ValidationMiddleware(UserDTO))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser(@Body() userCreateDTO: UserCreateDTO) {
    return { data: await this.user.createUser(userCreateDTO), message: 'created' };
  }

  // @Put('/users/:id')
  // @UseBefore(ValidationMiddleware(UserDto, true))
  // @OpenAPI({ summary: 'Update a user' })
  // async updateUser(@Param('id') userId: number, @Body() userData: User) {
  //   const updateUserData: User[] = await this.user.updateUser(userId, userData);
  //   return { data: updateUserData, message: 'updated' };
  // }

  @Delete('/users/:id')
  @UseBefore(AuthMiddleware)
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser(@Param('id') userId: string) {
    const deleteUserData: User[] = await this.user.deleteUser(userId);
    return { data: deleteUserData, message: 'deleted' };
  }
}
