import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export default class CreateConnectionStatisticDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  reportDate: Date;

  @IsString()
  tunnelClientId: string;

  @IsNumber()
  value: number;
}
