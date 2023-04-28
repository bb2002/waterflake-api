import { Injectable } from '@nestjs/common';
import CreateTrafficStatisticDto from './dto/CreateTrafficStatistic.dto';
import CreateConnectionStatisticDto from './dto/CreateConnectionStatistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, createConnection, Repository } from 'typeorm';
import TrafficStatisticEntity from './entities/traffic-statistic.entity';
import ConnectionStatisticEntity from './entities/connection-statistic.entity';
import { TunnelsService } from '../tunnels/services/tunnels.service';
import { format, getISOWeek } from 'date-fns';
import GetStatisticsDto from './dto/GetStatistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(TrafficStatisticEntity)
    private readonly trafficStatisticRepository: Repository<TrafficStatisticEntity>,
    @InjectRepository(ConnectionStatisticEntity)
    private readonly connectionStatisticRepository: Repository<ConnectionStatisticEntity>,
    private readonly tunnelsService: TunnelsService,
  ) {}

  async createTrafficStatistics(
    createTrafficStatisticDtos: CreateTrafficStatisticDto[],
  ) {
    for (const dto of createTrafficStatisticDtos) {
      const { reportDate, tunnelClientId, value } = dto;
      const tunnel = await this.tunnelsService.getTunnelByClientId(
        tunnelClientId,
      );

      if (tunnel) {
        const dateOptions = this.buildDateOptions(reportDate);
        await this.trafficStatisticRepository.manager.transaction(
          async (entityManager) => {
            const repo = entityManager.withRepository(
              this.trafficStatisticRepository,
            );
            await repo.delete({
              tunnel,
              date: new Date(dateOptions.date),
              time: dateOptions.time,
            });
            await repo.insert({
              value,
              ...this.buildDateOptions(reportDate),
              tunnel,
              region: tunnel.region,
            });
          },
        );
      }
    }
  }

  async createConnectionStatistics(
    createConnectionStatisticDtos: CreateConnectionStatisticDto[],
  ) {
    for (const dto of createConnectionStatisticDtos) {
      const { reportDate, tunnelClientId, value } = dto;
      const tunnel = await this.tunnelsService.getTunnelByClientId(
        tunnelClientId,
      );

      if (tunnel) {
        const dateOptions = this.buildDateOptions(reportDate);
        await this.connectionStatisticRepository.manager.transaction(
          async (entityManager) => {
            const repo = entityManager.withRepository(
              this.connectionStatisticRepository,
            );

            await repo.delete({
              tunnel,
              date: dateOptions.date,
              time: dateOptions.time,
            });
            await repo.insert({
              value,
              ...this.buildDateOptions(reportDate),
              tunnel,
            });
          },
        );
      }
    }
  }

  async getDailyTrafficStatistics(getStatisticDto: GetStatisticsDto) {
    const tunnel = await this.tunnelsService.getTunnelByClientId(
      getStatisticDto.clientId,
    );

    return this.trafficStatisticRepository
      .createQueryBuilder('tf')
      .select('tf.date as date')
      .orderBy('tf.date', 'ASC')
      .addSelect('SUM(tf.value) as value')
      .where('tf.tunnel_id = :tunnelId', { tunnelId: tunnel._id })
      .groupBy('tf.date')
      .limit(20)
      .getRawMany();
  }

  async getDailyConnectionStatistics(getStatisticDto: GetStatisticsDto) {
    const tunnel = await this.tunnelsService.getTunnelByClientId(
      getStatisticDto.clientId,
    );

    return this.connectionStatisticRepository
      .createQueryBuilder('tf')
      .select('tf.date as date')
      .orderBy('tf.date', 'ASC')
      .addSelect('AVG(tf.value) as value')
      .where('tf.tunnel_id = :tunnelId', { tunnelId: tunnel._id })
      .groupBy('tf.date')
      .limit(20)
      .getRawMany();
  }

  private buildDateOptions(date: Date) {
    return {
      dateOfMonth: format(date, 'yyyy-MM'),
      dateOfWeek: `${format(date, 'yyyy')}-${getISOWeek(date)}`,
      date: format(date, 'yyyy-MM-dd'),
      time: format(date, 'HH:mm:ss'),
    };
  }
}
