import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { EmailPipe } from 'src/shared/pipes/email.pipe';
import { UserNamePipe } from 'src/shared/pipes/user-name.pipe';

@ApiTags(`Users`)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  getAll() {
    return this.userService.findAll();
  }
  @Post(`create`)
  createUser(
    @Body(new PasswordPipe(true), EmailPipe, UserNamePipe) body: CreateUserDto,
  ) {
    return this.userService.createUser(body);
  }
}
