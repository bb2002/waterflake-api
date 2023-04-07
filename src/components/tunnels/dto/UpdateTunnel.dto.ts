import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export default class UpdateTunnelDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @IsOptional()
  name?: string;
}
