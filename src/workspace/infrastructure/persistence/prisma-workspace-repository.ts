import { Injectable } from '@nestjs/common';
import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';

@Injectable()
export class PrismaWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createWithOwner(
    data: { name: string; slug: string },
    ownerId: string,
  ): Promise<Workspace> {
    return this.prismaService.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          slug: data.slug,
          name: data.name,
        },
      });
      await tx.workspaceMember.create({
        data: {
          userId: ownerId,
          role: WorkspaceRole.OWNER,
          workspaceId: workspace.id,
        },
      });
      return workspace;
    });
  }
  async updateWorkspace(
    workspaceId: string,
    data: { name?: string; slug?: string },
  ): Promise<Workspace> {
    return this.prismaService.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
  }
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.prismaService.workspace.delete({
      where: { id: workspaceId },
    });
  }
  async findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null> {
    return this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          workspaceId,
          userId,
        },
      },
    });
  }
  async addMember(data: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }): Promise<WorkspaceMember & { workspace: Workspace }> {
    return this.prismaService.workspaceMember.create({
      data: {
        workspaceId: data.workspaceId,
        userId: data.userId,
        role: data.role,
      },
      include: {
        workspace: true,
      },
    });
  }
  async deleteMember(userId: string, workspaceId: string): Promise<void> {
    await this.prismaService.workspaceMember.delete({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });
  }
}
