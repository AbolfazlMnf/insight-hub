import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { WorkspaceRole } from 'src/generated/prisma/enums';

export class AddWorkspaceMemberDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  targetUserId!: string;
  @IsEnum(WorkspaceRole)
  @IsNotEmpty()
  @ApiProperty({ enum: WorkspaceRole })
  role!: WorkspaceRole;
}
