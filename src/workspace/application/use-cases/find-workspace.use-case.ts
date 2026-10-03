import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';

@Injectable()
export class FindWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: { workspaceId: string; currentUserId: string }) {
    const workspace = await this.workspaceRepository.findWorkspace(
      input.workspaceId,
      input.currentUserId,
    );
    if (!workspace) {
      throw new NotFoundException();
    }
    return workspace;
  }
}
