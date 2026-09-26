import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWorkspaceMemberDto } from './dtos/add-workspace-member.dto';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { RemoveWorkSpaceMemberDto } from './dtos/remove-member.dto';

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

    return workspaces;
  }
  async getCurrentMember(currentUserId: string, workspaceId: string) {
    const currentMember = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: currentUserId, workspaceId },
      },
    });
    if (!currentMember) {
      throw new ForbiddenException();
    }
    return currentMember;
  }
  async getTargetMember(targetUserId: string, workspaceId: string) {
    const targetMember = await this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId: targetUserId, workspaceId },
      },
    });
    if (!targetMember) {
      throw new NotFoundException(`member not found`);
    }
    return targetMember;
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
    const currentMember = await this.getCurrentMember(
      currentUserId,
      workspaceId,
    );
    if (
      currentMember.role !== WorkspaceRole.ADMIN &&
      currentMember.role !== WorkspaceRole.OWNER
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
  async getWorkspaceMembers(currentUserId: string, workspaceId: string) {
    await this.getCurrentMember(currentUserId, workspaceId);
    const workspaceUsers = await this.prismaService.workspaceMember.findMany({
      where: { workspaceId },
      select: {
        role: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
    if (!workspaceUsers) {
      throw new NotFoundException();
    }
    return workspaceUsers;
  }
  async removeWorkspaceMember(
    currentUserId: string,
    body: RemoveWorkSpaceMemberDto,
    workspaceId: string,
  ) {
    const { targetUserId } = body;
    const currentMember = await this.getCurrentMember(
      currentUserId,
      workspaceId,
    );
    if (currentMember.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException();
    }
    const targetMember = await this.getTargetMember(targetUserId, workspaceId);
    if (
      currentMember.role === WorkspaceRole.ADMIN &&
      targetMember.role !== WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException(`admin just can delete member`);
    }
    if (targetMember.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException(`owner cant be removed`);
    }

    await this.prismaService.workspaceMember.delete({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });
  }
}
