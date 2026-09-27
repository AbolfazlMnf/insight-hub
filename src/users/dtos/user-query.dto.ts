import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { WorkspaceRole } from 'src/generated/prisma/enums';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { GeneralSortOrder } from 'src/shared/types/general';

enum UserSort {
  CreatedAt = `createdAt`,
  Username = `username`,
}
export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: WorkspaceRole })
  @IsEnum(WorkspaceRole)
  @IsOptional()
  role?: WorkspaceRole;

  @ApiPropertyOptional({
    enum: UserSort,
    default: UserSort.CreatedAt,
  })
  @IsEnum(UserSort)
  @IsOptional()
  sortBy: UserSort = UserSort.CreatedAt;
  @ApiPropertyOptional({
    enum: GeneralSortOrder,
    default: GeneralSortOrder.DESC,
  })
  @IsEnum(GeneralSortOrder)
  @IsOptional()
  sortOrder: GeneralSortOrder = GeneralSortOrder.DESC;
}
