import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';

@Injectable()
export class WorkspaceMemberAccessService {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}
  async getCurrentMember(workspaceId: string, userId: string) {
    const currentMember = await this.workspaceRepository.findMember(
      userId,
      workspaceId,
    );
    if (!currentMember) {
      throw new ForbiddenException(
        `user is not a member of this workspace or not founded`,
      );
    }
    return currentMember;
  }
  async getTargetMember(workspaceId: string, userId: string) {
    const targetMember = await this.workspaceRepository.findMember(
      userId,
      workspaceId,
    );
    if (!targetMember) {
      throw new NotFoundException(`user not found`);
    }
    return targetMember;
  }
}
