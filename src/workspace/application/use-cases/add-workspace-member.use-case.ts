import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';
import { WorkspaceRole } from 'src/generated/prisma/enums';

@Injectable()
export class AddWorkspaceMemberUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: {
    currentUserId: string;
    targetUserId: string;
    workspaceId: string;
    role: WorkspaceRole;
  }) {
    const currentMember =
      await this.workspaceMemberAccessService.getCurrentMember(
        input.workspaceId,
        input.currentUserId,
      );
    if (currentMember.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException();
    }

    if (
      currentMember.role === WorkspaceRole.ADMIN &&
      input.role !== WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException(
        `Admin can only add members with MEMBER role`,
      );
    }
    if (input.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException('Cannot assign OWNER role');
    }
    return this.workspaceRepository.addMember({
      workspaceId: input.workspaceId,
      userId: input.targetUserId,
      role: input.role,
    });
  }
}
