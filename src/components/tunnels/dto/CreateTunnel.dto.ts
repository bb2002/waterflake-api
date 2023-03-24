import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import LocalServer from '../../../common/enums/LocalServer';
import RootDomain from '../../../common/enums/RootDomain';

export default class CreateTunnelDto {
  @IsEnum(LocalServer)
  localServer: LocalServer;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  subDomain: string;

  @IsEnum(RootDomain)
  rootDomain: RootDomain;

  @IsNumber()
  planId: number;

  @IsNumber()
  regionId: number;
}
