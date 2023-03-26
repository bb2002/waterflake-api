import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Protocol } from '../../../common/enums/Protocol';

export default class CreateSRVRecordDto {
  @IsEnum(Protocol)
  protocol: Protocol;

  @IsString()
  subDomain: string;

  @IsNumber()
  port: number;

  @IsString()
  target: string;

  @IsString()
  zoneId: string;
}
