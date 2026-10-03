import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from 'src/generated/prisma/client';

export interface WorkspaceRepository {
  createWithOwner(
    data: { name: string; slug: string },
    ownerId: string,
  ): Promise<Workspace>;

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
}
