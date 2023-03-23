import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TunnelsService } from './services/tunnels.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import UserEntity from '../users/entities/user.entity';
import CreateTunnelDto from './dto/CreateTunnel.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('tunnels')
export class TunnelsController {
  constructor(private readonly tunnelsService: TunnelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/new')
  async createTunnel(
    @CurrentUser() user: UserEntity,
    @Body() createTunnelDto: CreateTunnelDto,
  ) {}
}
