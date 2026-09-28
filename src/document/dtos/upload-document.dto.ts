import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({
    example: 'Attention Is All You Need',
  })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ type: `string`, format: `binary`, required: true })
  file!: any;
}
