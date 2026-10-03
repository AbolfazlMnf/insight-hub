import { Injectable } from '@nestjs/common';
import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeneralSortOrder } from 'src/shared/types/general';
import { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceSort } from 'src/workspace/presentation/dtos/workspace-query.dto';

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

  async findWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<(WorkspaceMember & { workspace: Workspace }) | null> {
    return this.prismaService.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
      include: {
        workspace: true,
      },
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
  async changeMemberRole(data: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }): Promise<WorkspaceMember> {
    return this.prismaService.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId: data.userId,
          workspaceId: data.workspaceId,
        },
      },
      data: {
        role: data.role,
      },
    });
  }
  async findUserWorkspaces(input: {
    userId: string;
    page: number;
    limit: number;
    sortBy?: WorkspaceSort;
    sortOrder?: GeneralSortOrder;
    search?: string;
    role?: WorkspaceRole;
  }): Promise<{
    data: Array<WorkspaceMember & { workspace: Workspace }>;
    totalCount: number;
  }> {
    const {
      sortBy = WorkspaceSort.CreatedAt,
      userId,
      page,
      limit,
      search,
      sortOrder = GeneralSortOrder.DESC,
      role,
    } = input;

    const [data, count] = await Promise.all([
      this.prismaService.workspaceMember.findMany({
        where: {
          userId: userId,
          role,
          workspace: {
            name: {
              contains: search,
              mode: `insensitive`,
            },
          },
        },
        include: {
          workspace: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          workspace: {
            [sortBy]: sortOrder,
          },
        },
      }),
      this.prismaService.workspaceMember.count({
        where: {
          userId: userId,
          role,
          workspace: {
            name: {
              contains: search,
              mode: `insensitive`,
            },
          },
        },
      }),
    ]);
    return { data, totalCount: count };
  }
  findWorkspaceMembers(workspaceId: string): Promise<
    Array<{
      role: WorkspaceRole;
      createdAt: Date;
      updatedAt: Date;
      user: {
        id: string;
        name: string | null;
        username: string;
        email: string;
      };
    }>
  > {
    return this.prismaService.workspaceMember.findMany({
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
  }
}
