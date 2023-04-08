import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { RegionsModule } from '../regions/regions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConnectionStatisticEntity from './entities/connection-statistic.entity';
import TrafficStatisticEntity from './entities/traffic-statistic.entity';
import { TunnelsModule } from '../tunnels/tunnels.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    TypeOrmModule.forFeature([
      ConnectionStatisticEntity,
      TrafficStatisticEntity,
    ]),
    RegionsModule,
    TunnelsModule,
  ],
})
export class StatisticsModule {}
