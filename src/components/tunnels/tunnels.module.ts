import { forwardRef, Module } from '@nestjs/common';
import { TunnelsController } from './tunnels.controller';
import { TunnelsService } from './services/tunnels.service';
import { CloudflareService } from './services/cloudflare.service';
import { PoliciesModule } from '../policies/policies.module';
import { PlansModule } from '../plans/plans.module';
import { RegionsModule } from '../regions/regions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import TunnelEntity from './entities/tunnel.entity';
import { TunnelServerService } from './services/tunnel-server.service';

@Module({
  controllers: [TunnelsController],
  providers: [TunnelsService, CloudflareService, TunnelServerService],
  imports: [
    PoliciesModule,
    PlansModule,
    forwardRef(() => RegionsModule),
    TypeOrmModule.forFeature([TunnelEntity]),
  ],
  exports: [TunnelsService],
})
export class TunnelsModule {}
