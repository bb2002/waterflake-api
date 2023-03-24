import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TunnelsService } from './services/tunnels.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import UserEntity from '../users/entities/user.entity';
import CreateTunnelDto from './dto/CreateTunnel.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import rootDomain from '../../common/enums/RootDomain';
import { PlansService } from '../plans/plans.service';
import { RegionsService } from '../regions/regions.service';
import RootDomain from '../../common/enums/RootDomain';

@Controller('tunnels')
export class TunnelsController {
  constructor(
    private readonly tunnelsService: TunnelsService,
    private readonly plansService: PlansService,
    private readonly regionsService: RegionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/new')
  async createTunnel(
    @CurrentUser() user: UserEntity,
    @Body() createTunnelDto: CreateTunnelDto,
  ) {
    // Check can user create tunnel
    await this.tunnelsService.validateCanUserCreateTunnel(user);

    const plan = await this.plansService.getPlanById(createTunnelDto.planId);
    const region = await this.regionsService.getRegionById(
      createTunnelDto.regionId,
    );

    // TODO
    // check plan and region

    // Check is domain name valid
    await this.tunnelsService.validateDomain(
      {
        subDomain: createTunnelDto.subDomain,
        rootDomain: createTunnelDto.rootDomain,
      },
      plan,
    );

    console.log('user', user);
    console.log('createTunnelDto', createTunnelDto);
  }
}
