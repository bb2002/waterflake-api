import { Injectable } from '@nestjs/common';
import CreateTrafficStatisticDto from './dto/CreateTrafficStatistic.dto';
import CreateConnectionStatisticDto from './dto/CreateConnectionStatistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TrafficStatisticEntity from './entities/traffic-statistic.entity';
import ConnectionStatisticEntity from './entities/connection-statistic.entity';
import { TunnelsService } from '../tunnels/services/tunnels.service';

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
        await this.trafficStatisticRepository.upsert({
          date: formatreportDate,
        });
      }
    }
  }

  async createConnectionStatistics(
    createConnectionStatisticDtos: CreateConnectionStatisticDto[],
  ) {}
}
