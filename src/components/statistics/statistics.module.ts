import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { RegionsModule } from '../regions/regions.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [RegionsModule],
})
export class StatisticsModule {}
