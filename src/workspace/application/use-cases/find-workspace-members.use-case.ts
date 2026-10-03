import { Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';

@Injectable()
export class FindWorkspaceMembersUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: { workspaceId: string; userId: string }) {
    await this.workspaceMemberAccessService.getCurrentMember(
      input.workspaceId,
      input.userId,
    );
    return this.workspaceRepository.findWorkspaceMembers(input.workspaceId);
  }
}
