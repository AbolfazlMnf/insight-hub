import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWorkspaceMemberDto } from './dtos/add-workspace-member.dto';
import { WorkspaceRole } from 'src/generated/prisma/enums';

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
  async addWorkspaceMember(
    body: AddWorkspaceMemberDto,
    currentUserId: string,
    workspaceId: string,
  ) {
    const { targetUserId, role } = body;
    const currentMember = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: currentUserId, workspaceId },
      },
    });
    if (
      !currentMember ||
      (currentMember.role !== WorkspaceRole.ADMIN &&
        currentMember.role !== WorkspaceRole.OWNER)
    ) {
      throw new ForbiddenException();
    }
    if (
      currentMember.role === WorkspaceRole.ADMIN &&
      role !== WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException(
        'Admin can only add members with MEMBER role',
      );
    }
    if (role === WorkspaceRole.OWNER) {
      throw new ForbiddenException('Cannot assign OWNER role');
    }
    const newWorkspaceMember = await this.prismaService.workspaceMember.create({
      data: {
        userId: targetUserId,
        role,
        workspaceId,
      },
      include: {
        workspace: true,
      },
    });
    return newWorkspaceMember;
  }
}
