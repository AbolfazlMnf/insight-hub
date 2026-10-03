import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from 'src/generated/prisma/client';
import { GeneralSortOrder } from 'src/shared/types/general';
import { WorkspaceSort } from 'src/workspace/presentation/dtos/workspace-query.dto';

export interface WorkspaceRepository {
  createWithOwner(
    data: { name: string; slug: string },
    ownerId: string,
  ): Promise<Workspace>;
  findWorkspace(
    workspaceId: string,
    userId: string,
  ): Promise<(WorkspaceMember & { workspace: Workspace }) | null>;
  updateWorkspace(
    workspaceId: string,
    data: { name?: string; slug?: string },
  ): Promise<Workspace>;
  deleteWorkspace(workspaceId: string): Promise<void>;
  findMember(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null>;
  addMember(data: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }): Promise<WorkspaceMember & { workspace: Workspace }>;
  deleteMember(userId: string, workspaceId: string): Promise<void>;
  changeMemberRole(data: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }): Promise<WorkspaceMember>;

  findUserWorkspaces(input: {
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
  }>;

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
  >;
}
