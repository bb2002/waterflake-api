import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { RegionAccessTokenGuard } from '../../common/guards/region-access-token.guard';
import CreateTrafficStatisticDto from './dto/CreateTrafficStatistic.dto';
import CreateConnectionStatisticDto from './dto/CreateConnectionStatistic.dto';
import CreateStatisticDto from './dto/CreateStatistic.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import GetStatisticsDto from './dto/GetStatistics.dto';
import { TunnelsService } from '../tunnels/services/tunnels.service';
import UserEntity from '../users/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly tunnelsService: TunnelsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/traffic')
  async getTrafficStatistics(
    @CurrentUser() user: UserEntity,
    @Query() getStatisticDto: GetStatisticsDto,
  ) {
    await this.validateIsTunnelOwner(user, getStatisticDto.clientId);
    return this.statisticsService.getDailyTrafficStatistics(getStatisticDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/connection')
  async getConnectionStatistics(
    @CurrentUser() user: UserEntity,
    @Query() getStatisticDto: GetStatisticsDto,
  ) {
    await this.validateIsTunnelOwner(user, getStatisticDto.clientId);
    return this.statisticsService.getDailyConnectionStatistics(getStatisticDto);
  }

  @UseGuards(RegionAccessTokenGuard)
  @Post('/traffic')
  async reportTrafficStatistics(
    @CurrentUser() user: UserEntity,
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

  private async validateIsTunnelOwner(user: UserEntity, clientId: string) {
    const tunnel = await this.tunnelsService.getTunnelByClientId(clientId);
    if (!tunnel) {
      throw new NotFoundException();
    }

    if (tunnel.owner._id !== user._id) {
      throw new ForbiddenException();
    }
  }
}
