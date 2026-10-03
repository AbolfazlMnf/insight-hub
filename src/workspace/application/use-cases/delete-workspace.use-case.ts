import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';
import { WorkspaceRole } from 'src/generated/prisma/enums';

@Injectable()
export class DeleteWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: { workspaceId: string; currentUserId: string }) {
    const currentMember =
      await this.workspaceMemberAccessService.getCurrentMember(
        input.currentUserId,
        input.workspaceId,
      );
    if (currentMember.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException(`only owner can delete workspace`);
    }
    await this.workspaceRepository.deleteWorkspace(input.workspaceId);
    return { message: `workspace deleted successfully` };
  }
}
