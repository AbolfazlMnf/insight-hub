import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { WorkspaceService } from './workspace.service';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('workspace')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}
  @Post(`create`)
  createWorkspace(@Body() body: CreateWorkspaceDto, @User() userId: string) {
    return this.workspaceService.createWorkspace(body, userId);
  }
  @Get(`:id`)
  getWorkSpace(@Param(`id`) id: string, @User() userId: string) {
    return this.workspaceService.getWorkSpace(id, userId);
  }
}
