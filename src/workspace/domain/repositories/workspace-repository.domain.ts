import { Workspace } from 'src/generated/prisma/client';

export interface WorkspaceRepository {
  create(data: { name: string; slug: string }): Promise<Workspace | null>;

  update(
    workspaceId: string,
    data: { name?: string; slug?: string },
  ): Promise<Workspace>;
  delete(workspaceId: string): Promise<void>;
}
