import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { WorkspaceService } from './workspace.service';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddWorkspaceMemberDto } from './dtos/add-workspace-member.dto';

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
  @Post(`:id/members`)
  addWorkSpaceMember(
    @Body() body: AddWorkspaceMemberDto,
    @User() currentUserId: string,
    @Param(`id`) workspaceId: string,
  ) {
    return this.workspaceService.addWorkspaceMember(
      body,
      currentUserId,
      workspaceId,
    );
  }
  @Get(`:id/members`)
  getWorkspaceMembers(@User() currentUserId: string, @Param(`id`) id: string) {
    return this.workspaceService.getWorkspaceMembers(currentUserId, id);
  }
}
