import { IsString } from 'class-validator';

export default class GetStatisticsDto {
  @IsString()
  clientId: string;
}
