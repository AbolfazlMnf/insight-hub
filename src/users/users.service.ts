import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return this.prismaService.user.findMany();
  }
  async createUser(body: CreateUserDto) {
    const newUser = await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        username: body.username,
        password: body.password,
      },
    });

    return newUser;
  }
}
