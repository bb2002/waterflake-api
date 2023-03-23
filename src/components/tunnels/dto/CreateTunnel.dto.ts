import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import LocalServer from '../../../common/enums/LocalServer';

export default class CreateTunnelDto {
  @IsEnum(LocalServer)
  localServer: LocalServer;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  planId: number;

  @IsNumber()
  regionId: number;
}
