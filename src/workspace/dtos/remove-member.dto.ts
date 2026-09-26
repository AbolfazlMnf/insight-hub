import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveWorkSpaceMemberDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  targetUserId!: string;
}
