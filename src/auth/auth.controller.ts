import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { EmailPipe } from 'src/shared/pipes/email.pipe';
import { UserNamePipe } from 'src/shared/pipes/user-name.pipe';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post(`login`)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  @Post(`sign-up`)
  createUser(
    @Body(new PasswordPipe(true), EmailPipe, UserNamePipe) body: CreateUserDto,
  ) {
    return this.userService.createUser(body);
  }
}
