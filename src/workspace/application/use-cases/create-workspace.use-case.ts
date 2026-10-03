import { Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from '../../constants/workspace.token';
import type { WorkspaceRepository } from '../../domain/repositories/workspace-repository.domain';
import { ICreateWorkspaceInput } from '../types/create-workspace-input.type';

@Injectable()
export class CreateWorkspaceUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}
  execute(input: ICreateWorkspaceInput, ownerId: string) {
    return this.workspaceRepository.createWithOwner(
      {
        name: input.name,
        slug: input.slug,
      },
      ownerId,
    );
  }
}
