import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';

@Module({
  providers: [RegionsService]
})
export class RegionsModule {}
