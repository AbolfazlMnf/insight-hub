import { BadRequestException, Injectable } from '@nestjs/common';
import { createWorkspaceDto } from './dtos/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}
}
