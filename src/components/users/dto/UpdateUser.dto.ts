import { IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
