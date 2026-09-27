import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWorkspaceMemberDto } from './dtos/add-workspace-member.dto';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { RemoveWorkSpaceMemberDto } from './dtos/remove-member.dto';
import { ChangeWorkspaceMemberRoleDto } from './dtos/change-member-role.dto';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { WorkspaceQueryDto } from './dtos/workspace-query.dto';

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
  async getUserWorkspaces(userId: string, query: WorkspaceQueryDto) {
    const { page, limit, role, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      userId,
      workspace: {
        name: {
          contains: search,
          mode: `insensitive` as const,
        },
      },
      role,
    };
    const [workspaces, count] = await Promise.all([
      this.prismaService.workspaceMember.findMany({
        where,
        include: {
          workspace: true,
        },
        skip,
        take: limit,
      }),
      this.prismaService.workspaceMember.count({
        where,
      }),
    ]);
    return {
      workspaces,
      meta: {
        page,
        limit,
        totalCount: count,
        totalPage: Math.ceil(count / limit),
      },
    };
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
    return {
      message: 'Member removed successfully',
    };
  }
  async changeWorkspaceMemberRole(
    body: ChangeWorkspaceMemberRoleDto,
    currentUserId: string,
    workspaceId: string,
  ) {
    const { targetUserId, role } = body;
    if (role === WorkspaceRole.OWNER) {
      throw new BadRequestException(`cant change role to owner`);
    }
    const currentMember = await this.getCurrentMember(
      currentUserId,
      workspaceId,
    );
    if (currentMember.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException('Only owner can change member roles');
    }
    const targetMember = await this.getTargetMember(targetUserId, workspaceId);
    if (targetMember.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException(`cant change owner's role`);
    }
    return this.prismaService.workspaceMember.update({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
      data: {
        role,
      },
    });
  }
  async updateWorkspace(
    body: UpdateWorkspaceDto,
    currentUserId: string,
    workspaceId: string,
  ) {
    const currentMember = await this.getCurrentMember(
      currentUserId,
      workspaceId,
    );
    if (currentMember.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException(`member cant update workspace !!`);
    }
    const updatedWorkspace = await this.prismaService.workspace.update({
      where: { id: workspaceId },
      data: {
        name: body.name,
        slug: body.slug,
      },
    });
    return updatedWorkspace;
  }
  async deleteWorkspace(currentUserId: string, workspaceId: string) {
    const currentMember = await this.getCurrentMember(
      currentUserId,
      workspaceId,
    );
    if (currentMember.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException(`only owner can delete workspace`);
    }
    await this.prismaService.workspace.delete({ where: { id: workspaceId } });
    return { message: `workspace deleted successfully` };
  }
}
