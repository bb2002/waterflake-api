import {
  Controller,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RegionAccessTokenGuard } from '../../common/guards/region-access-token.guard';
import TunnelEntity from '../tunnels/entities/tunnel.entity';
import { RegionsService } from './regions.service';
import { TunnelsService } from '../tunnels/services/tunnels.service';
import { CurrentRegion } from '../../common/decorators/current-region.decorator';
import RegionEntity from './entities/region.entity';

@Controller('regions')
export class RegionsController {
  constructor(
    private readonly regionsService: RegionsService,
    @Inject(forwardRef(() => TunnelsService))
    private readonly tunnelsService: TunnelsService,
  ) {}

  @UseGuards(RegionAccessTokenGuard)
  @Get('/tunnel/:clientId')
  async getTunnelByClientId(
    @Param('clientId') clientId: string,
  ): Promise<TunnelEntity> {
    const tunnel = await this.tunnelsService.getTunnelByClientId(clientId);

    if (!tunnel) {
      throw new NotFoundException();
    }

    return tunnel;
  }

  @UseGuards(RegionAccessTokenGuard)
  @Get('/tunnels')
  async getAllTunnels(@CurrentRegion() region: RegionEntity) {
    console.log('region:', region);
  }
}
