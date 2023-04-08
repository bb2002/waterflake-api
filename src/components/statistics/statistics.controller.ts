import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RegionAccessTokenGuard } from '../../common/guards/region-access-token.guard';
import CreateTrafficStatisticDto from './dto/CreateTrafficStatistic.dto';
import CreateConnectionStatisticDto from './dto/CreateConnectionStatistic.dto';
import CreateStatisticDto from './dto/CreateStatistic.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(RegionAccessTokenGuard)
  @Post('/traffic')
  async reportTrafficStatistics(
    @Body(new ParseArrayPipe({ items: CreateTrafficStatisticDto }))
    createTrafficDto: CreateTrafficStatisticDto[],
  ) {
    const mergedDtos =
      this.mergeStatisticDto<CreateConnectionStatisticDto>(createTrafficDto);

    return this.statisticsService.createTrafficStatistics(mergedDtos);
  }

  @UseGuards(RegionAccessTokenGuard)
  @Post('/connection')
  async reportConnectionStatistics(
    @Body(new ParseArrayPipe({ items: CreateConnectionStatisticDto }))
    createConnectionDto: CreateConnectionStatisticDto[],
  ) {
    const mergedDtos =
      this.mergeStatisticDto<CreateConnectionStatisticDto>(createConnectionDto);

    return this.statisticsService.createConnectionStatistics(mergedDtos);
  }

  private mergeStatisticDto<T>(createStatisticDtos: CreateStatisticDto[]): T[] {
    return createStatisticDtos.reduce((acc, dto) => {
      const existingDtoIndex = acc.findIndex(
        (value) => value.tunnelClientId === dto.tunnelClientId,
      );
      if (existingDtoIndex === -1) {
        acc.push(dto);
      } else {
        acc[existingDtoIndex] = {
          ...acc[existingDtoIndex],
          value: dto.value + acc[existingDtoIndex].value,
        };
      }
      return acc;
    }, []);
  }
}
