import { IsString } from 'class-validator';

export default class DeleteSRVRecordDto {
  @IsString()
  DNSRecordId: string;

  @IsString()
  zoneId: string;
}
