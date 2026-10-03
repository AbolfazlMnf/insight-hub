import { AddWorkspaceMemberUseCase } from './../application/use-cases/add-workspace-member.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { AddWorkspaceMemberDto } from './dtos/add-workspace-member.dto';
import { RemoveWorkSpaceMemberDto } from './dtos/remove-member.dto';
import { ChangeWorkspaceMemberRoleDto } from './dtos/change-member-role.dto';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';

import { WorkspaceService } from './workspace.service';

import { User } from 'src/shared/decorators/user.decorator';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { WorkspaceQueryDto } from './dtos/workspace-query.dto';
import { CreateWorkspaceUseCase } from '../application/use-cases/create-workspace.use-case';
import { DeleteWorkspaceMemberUseCase } from '../application/use-cases/delete-workspace-member.use-case';
import { ChangeWorkspaceMemberRoleUseCase } from '../application/use-cases/change-workspace-member-role.use-case';
import { UpdateWorkspaceUseCase } from '../application/use-cases/update-workspace.use-case';
import { DeleteWorkspaceUseCase } from '../application/use-cases/delete-workspace.use-case';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
    private readonly addWorkspaceMemberUseCase: AddWorkspaceMemberUseCase,
    private readonly deleteWorkspaceMemberUseCase: DeleteWorkspaceMemberUseCase,
    private readonly changeWorkspaceMemberRoleUseCase: ChangeWorkspaceMemberRoleUseCase,
    private readonly updateWorkspaceUseCase: UpdateWorkspaceUseCase,
    private readonly deleteWorkspaceUseCase: DeleteWorkspaceUseCase,
  ) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new workspace',
    description:
      'Creates a workspace and assigns the authenticated user as its owner.',
  })
  createWorkspace(@Body() body: CreateWorkspaceDto, @User() userId: string) {
    return this.createWorkspaceUseCase.execute(
      { name: body.name, slug: body.slug },
      userId,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get user workspaces',
    description:
      'Returns all workspaces that the authenticated user is a member of.',
  })
  getUserWorkspaces(@User() userId: string, @Query() query: WorkspaceQueryDto) {
    return this.workspaceService.getUserWorkspaces(userId, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workspace',
    description:
      'Returns a workspace if the authenticated user is a member of it.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  getWorkSpace(@Param('id') id: string, @User() userId: string) {
    return this.workspaceService.getWorkSpace(id, userId);
  }

  @Post(':id/members')
  @ApiOperation({
    summary: 'Add workspace member',
    description:
      'Adds a new member to the workspace. Owner can add admins or members. Admin can only add members.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  addWorkSpaceMember(
    @Body() body: AddWorkspaceMemberDto,
    @User() currentUserId: string,
    @Param('id') workspaceId: string,
  ) {
    return this.addWorkspaceMemberUseCase.execute({
      currentUserId: currentUserId,
      targetUserId: body.targetUserId,
      workspaceId,
      role: body.role,
    });
  }

  @Get(':id/members')
  @ApiOperation({
    summary: 'Get workspace members',
    description:
      'Returns the members of a workspace. The authenticated user must be a member of the workspace.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  getWorkspaceMembers(
    @User() currentUserId: string,
    @Param('id') workspaceId: string,
  ) {
    return this.workspaceService.getWorkspaceMembers(
      currentUserId,
      workspaceId,
    );
  }

  @Delete(':id/members')
  @ApiOperation({
    summary: 'Remove workspace member',
    description:
      'Removes a member from the workspace based on the current user workspace role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  removeWorkspaceMember(
    @Param('id') workspaceId: string,
    @User() currentUserId: string,
    @Body() body: RemoveWorkSpaceMemberDto,
  ) {
    return this.deleteWorkspaceMemberUseCase.execute({
      currentUserId: currentUserId,
      targetUserId: body.targetUserId,
      workspaceId,
    });
  }

  @Patch(':id/members/role')
  @ApiOperation({
    summary: 'Change workspace member role',
    description:
      'Changes a member role between ADMIN and MEMBER. Only the workspace owner can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  changeMemberRole(
    @Param('id') workspaceId: string,
    @Body() body: ChangeWorkspaceMemberRoleDto,
    @User() currentUserId: string,
  ) {
    return this.changeWorkspaceMemberRoleUseCase.execute({
      currentUserId,
      targetUserId: body.targetUserId,
      role: body.role,
      workspaceId,
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update workspace',
    description:
      'Updates workspace information. Owner and admin can update the workspace.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  updateWorkspace(
    @Body() body: UpdateWorkspaceDto,
    @Param('id') workspaceId: string,
    @User() currentUserId: string,
  ) {
    return this.updateWorkspaceUseCase.execute(
      { workspaceId, slug: body.slug, name: body.name },
      currentUserId,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete workspace',
    description:
      'Permanently deletes a workspace. Only the workspace owner can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace ID',
  })
  deleteWorkspace(
    @Param('id') workspaceId: string,
    @User() currentUserId: string,
  ) {
    return this.deleteWorkspaceUseCase.execute({ currentUserId, workspaceId });
  }
}
