import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './presentation/workspace.controller';
import { PrismaWorkspaceRepository } from './infrastructure/persistence/prisma-workspace-repository';
import { WORKSPACE_REPOSITORY } from './constants/workspace.token';
import { CreateWorkspaceUseCase } from './application/use-cases/create-workspace.use-case';
import { WorkspaceMemberAccessService } from './application/services/workspace-member-access.service';

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
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
