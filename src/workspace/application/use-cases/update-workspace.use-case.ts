import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';
import { WorkspaceRole } from 'src/generated/prisma/enums';

@Injectable()
export class UpdateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(
    input: { workspaceId: string; slug?: string; name?: string },
    currentUserId: string,
  ) {
    const currentMember =
      await this.workspaceMemberAccessService.getCurrentMember(
        input.workspaceId,
        currentUserId,
      );
    if (currentMember.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException(`member cant update workspace`);
    }
    return this.workspaceRepository.updateWorkspace(input.workspaceId, {
      name: input.name,
      slug: input.slug,
    });
  }
}
