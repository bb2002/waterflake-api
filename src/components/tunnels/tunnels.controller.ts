import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TunnelsService } from './services/tunnels.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import UserEntity from '../users/entities/user.entity';
import CreateTunnelDto from './dto/CreateTunnel.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PlansService } from '../plans/plans.service';
import InvalidInputException from '../../common/exceptions/InvalidInput.exception';
import TunnelEntity from './entities/tunnel.entity';

@Controller('tunnels')
export class TunnelsController {
  constructor(
    private readonly tunnelsService: TunnelsService,
    private readonly plansService: PlansService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/new')
  async createTunnel(
    @CurrentUser() user: UserEntity,
    @Body() createTunnelDto: CreateTunnelDto,
  ) {
    const plan = await this.plansService.getPlanById(createTunnelDto.planId);
    if (!plan) {
      throw new InvalidInputException();
    }

    // Check can user create tunnel
    await this.tunnelsService.validateCanUserCreateTunnel(user);

    // Check is domain name valid
    await this.tunnelsService.validateDomain(
      {
        subDomain: createTunnelDto.subDomain,
        rootDomain: createTunnelDto.rootDomain,
      },
      plan,
    );

    // Create Tunnel
    return this.tunnelsService.createTunnel(user, createTunnelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllTunnels(@CurrentUser() user: UserEntity) {
    return this.tunnelsService.getTunnelsByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:clientId')
  async getTunnel(
    @CurrentUser() user: UserEntity,
    @Param('clientId') clientId: string,
  ) {
    const tunnel = await this.tunnelsService.getTunnelByClientId(clientId);
    this.validateIsTunnelOwner(tunnel, user);

    return tunnel;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:clientId')
  async deleteTunnel(
    @CurrentUser() user: UserEntity,
    @Param('clientId') clientId: string,
  ) {
    const tunnel = await this.tunnelsService.getTunnelByClientId(clientId);
    this.validateIsTunnelOwner(tunnel, user);

    return this.tunnelsService.deleteTunnel(tunnel);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:clientId')
  async updateTunnel() {}

  private validateIsTunnelOwner(tunnel: TunnelEntity, owner: UserEntity) {
    if (tunnel.owner._id !== owner._id) {
      throw new NotFoundException();
    }
  }
}
