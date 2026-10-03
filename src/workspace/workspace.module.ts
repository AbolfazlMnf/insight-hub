import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './presentation/workspace.controller';
import { PrismaWorkspaceRepository } from './infrastructure/persistence/prisma-workspace-repository';
import { WORKSPACE_REPOSITORY } from './constants/workspace.token';
import { CreateWorkspaceUseCase } from './application/use-cases/create-workspace.use-case';

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
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
