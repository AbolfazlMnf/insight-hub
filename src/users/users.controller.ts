import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserRole } from 'src/generated/prisma/enums';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard, new RoleGuard([UserRole.ADMIN]))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns all registered users. Admin access only.',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiForbiddenResponse({
    description: 'Admin access is required.',
  })
  getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns the details of a user by their ID.',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  userDetail(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates user profile information.',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, new RoleGuard([UserRole.ADMIN]))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes a user from the system. Admin access only.',
  })
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiForbiddenResponse({
    description: 'Admin access is required.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
