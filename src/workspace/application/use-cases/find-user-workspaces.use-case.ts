import { Inject, Injectable } from '@nestjs/common';
import { WORKSPACE_REPOSITORY } from 'src/workspace/constants/workspace.token';
import type { WorkspaceRepository } from 'src/workspace/domain/repositories/workspace-repository.domain';
import { WorkspaceSort } from 'src/workspace/presentation/dtos/workspace-query.dto';
import { GeneralSortOrder } from 'src/shared/types/general';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { getPaginationMeta } from 'src/shared/utils/pagintaion';

@Injectable()
export class FindUserWorkspacesUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly workspaceRepository: WorkspaceRepository,
  ) {}
  async execute(input: {
    userId: string;
    page: number;
    limit: number;
    sortBy?: WorkspaceSort;
    sortOrder?: GeneralSortOrder;
    search?: string;
    role?: WorkspaceRole;
  }) {
    const { data, totalCount } =
      await this.workspaceRepository.findUserWorkspaces(input);
    const meta = getPaginationMeta(input.page, input.limit, totalCount);
    return { data, meta };
  }
}
