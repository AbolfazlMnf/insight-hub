import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
  }
  async createUser(body: CreateUserDto) {
    const newUser = await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        password: body.password,
      },
      omit: {
        password: true,
      },
    });

    return newUser;
  }
  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) {
      throw new NotFoundException(`User not Found !`);
    }
    return user;
  }
  async deleteUser(id: string) {
    const user = await this.findOne(id);
    await this.prismaService.user.delete({ where: { id: user.id } });
    return {
      message: 'User deleted successfully',
    };
  }
  async updateUser(id: string, body: UpdateUserDto) {
    const user = await this.findOne(id);
    return await this.prismaService.user.update({
      where: { id: user.id },
      data: { name: body.name, username: body.username, email: body.email },
      omit: {
        password: true,
      },
    });
  }
}
