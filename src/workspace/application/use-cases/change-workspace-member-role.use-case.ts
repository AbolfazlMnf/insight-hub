import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceMemberAccessService } from '../services/workspace-member-access.service';
import { WorkspaceRole } from 'src/generated/prisma/enums';

@Injectable()
export class ChangeWorkspaceMemberRoleUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly workspaceMemberAccessService: WorkspaceMemberAccessService,
  ) {}
  async execute(input: {
    currentUserId: string;
    targetUserId: string;
    role: WorkspaceRole;
    workspaceId: string;
  }) {
    const currentMember =
      await this.workspaceMemberAccessService.getCurrentMember(
        input.workspaceId,
        input.currentUserId,
      );
    if (currentMember.role !== WorkspaceRole.OWNER) {
      throw new ForbiddenException(`only owner can change members role`);
    }
    if (input.role === WorkspaceRole.OWNER) {
      throw new BadRequestException(`cant assign a owner role`);
    }
    const targetMember =
      await this.workspaceMemberAccessService.getTargetMember(
        input.workspaceId,
        input.targetUserId,
      );
    if (targetMember.role === WorkspaceRole.OWNER) {
      throw new ForbiddenException(`cant change role of owner`);
    }
    return this.workspaceRepository.changeMemberRole({
      workspaceId: input.workspaceId,
      userId: input.targetUserId,
      role: input.role,
    });
  }
}
