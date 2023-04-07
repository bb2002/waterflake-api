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

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(RegionAccessTokenGuard)
  @Post('/traffic')
  async reportTrafficStatistics(
    @Body(new ParseArrayPipe({ items: CreateTrafficStatisticDto }))
    createTrafficDto: CreateTrafficStatisticDto[],
  ) {
    console.log(createTrafficDto);
  }

  @UseGuards(RegionAccessTokenGuard)
  @Post('/connection')
  async reportConnectionStatistics(
    @Body(new ParseArrayPipe({ items: CreateConnectionStatisticDto }))
    createConnectionDto: CreateConnectionStatisticDto[],
  ) {
    console.log(createConnectionDto);
  }
}
