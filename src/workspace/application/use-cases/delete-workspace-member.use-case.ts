import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';
import { WorkspaceRole } from 'src/generated/prisma/enums';

@Injectable()
export class DeleteWorkspaceMemberUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: {
    currentUserId: string;
    targetUserId: string;
    workspaceId: string;
  }) {
    const currentMember =
      await this.workspaceMemberAccessService.getCurrentMember(
        input.workspaceId,
        input.currentUserId,
      );
    const targetMember =
      await this.workspaceMemberAccessService.getTargetMember(
        input.workspaceId,
        input.targetUserId,
      );

    if (currentMember.role === WorkspaceRole.MEMBER) {
      throw new ForbiddenException();
    }

    if (
      currentMember.role === WorkspaceRole.ADMIN &&
      targetMember.role !== WorkspaceRole.MEMBER
    ) {
      throw new ForbiddenException(
        'Admin can only remove members with MEMBER role',
      );
    }

    if (targetMember.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException('Owner cannot be removed');
    }

    await this.workspaceRepository.deleteMember(
      input.targetUserId,
      input.workspaceId,
    );
    return { message: `member deleted successfully` };
  }
}
