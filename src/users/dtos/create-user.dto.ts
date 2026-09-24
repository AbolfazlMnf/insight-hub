import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(4)
  name?: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: `string@gmail.com` })
  email!: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  username!: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsString()
  password!: string;
}
