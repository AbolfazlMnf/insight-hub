import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PasswordPipe } from 'src/shared/pipes/password.pipe';
import { EmailPipe } from 'src/shared/pipes/email.pipe';
import { UserNamePipe } from 'src/shared/pipes/user-name.pipe';
import { UpdateUserDto } from './dtos/update-user.dto';

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
  @Get(`:id`)
  userDetail(@Param(`id`) id: string) {
    return this.userService.findOne(id);
  }
  @Patch(`:id`)
  updateUser(@Param(`id`) id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }
  @Delete(`:id`)
  deleteUser(@Param(`id`) id: string) {
    return this.userService.deleteUser(id);
  }
}
