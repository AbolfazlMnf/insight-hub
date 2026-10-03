import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { GeneralSortOrder } from 'src/shared/types/general';

export enum WorkspaceSort {
  CreatedAt = `createdAt`,
  Name = `name`,
}
export class WorkspaceQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: WorkspaceRole })
  @IsEnum(WorkspaceRole)
  @IsOptional()
  role?: WorkspaceRole;

  @ApiPropertyOptional({
    enum: WorkspaceSort,
    default: WorkspaceSort.CreatedAt,
  })
  @IsEnum(WorkspaceSort)
  @IsOptional()
  sortBy: WorkspaceSort = WorkspaceSort.CreatedAt;
  @ApiPropertyOptional({
    enum: GeneralSortOrder,
    default: GeneralSortOrder.DESC,
  })
  @IsEnum(GeneralSortOrder)
  @IsOptional()
  sortOrder: GeneralSortOrder = GeneralSortOrder.DESC;
}
