import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';

export class WorkspaceQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: WorkspaceRole })
  @IsEnum(WorkspaceRole)
  @IsOptional()
  role?: WorkspaceRole;
}
