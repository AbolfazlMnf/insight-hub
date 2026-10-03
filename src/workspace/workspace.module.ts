import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './presentation/workspace.controller';
import { PrismaWorkspaceRepository } from './infrastructure/persistence/prisma-workspace-repository';
import { WORKSPACE_REPOSITORY } from './constants/workspace.token';
import { CreateWorkspaceUseCase } from './application/use-cases/create-workspace.use-case';
import { WorkspaceMemberAccessService } from './application/services/workspace-member-access.service';
import { AddWorkspaceMemberUseCase } from './application/use-cases/add-workspace-member.use-case';
import { DeleteWorkspaceMemberUseCase } from './application/use-cases/delete-workspace-member.use-case';
import { ChangeWorkspaceMemberRoleUseCase } from './application/use-cases/change-workspace-member-role.use-case';
import { UpdateWorkspaceUseCase } from './application/use-cases/update-workspace.use-case';
import { DeleteWorkspaceUseCase } from './application/use-cases/delete-workspace.use-case';

@Module({
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    PrismaWorkspaceRepository,
    {
      provide: WORKSPACE_REPOSITORY,
      useExisting: PrismaWorkspaceRepository,
    },
    CreateWorkspaceUseCase,
    WorkspaceMemberAccessService,
    AddWorkspaceMemberUseCase,
    DeleteWorkspaceMemberUseCase,
    ChangeWorkspaceMemberRoleUseCase,
    UpdateWorkspaceUseCase,
    DeleteWorkspaceUseCase,
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
