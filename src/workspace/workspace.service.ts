import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}
  async createWorkspace(body: CreateWorkspaceDto, userId: string) {
    return this.prismaService.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: body.name,
          slug: body.slug,
        },
      });
      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: `OWNER`,
        },
      });
      return workspace;
    });
  }
  async getUserWorkspaces(userId: string) {
    const workspaces = await this.prismaService.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: true,
      },
    });
    if (!workspaces) {
      throw new NotFoundException();
    }
    return workspaces;
  }
  async getWorkSpace(id: string, userId: string) {
    const workspace = await this.prismaService.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: id } },
      include: { workspace: true },
    });
    if (!workspace) {
      throw new NotFoundException();
    }
    return workspace;
  }
  async addWorkspaceMember() {}
}
