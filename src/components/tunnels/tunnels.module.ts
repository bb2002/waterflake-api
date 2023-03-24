import { Module } from '@nestjs/common';
import { TunnelsController } from './tunnels.controller';
import { TunnelsService } from './services/tunnels.service';
import { CloudflareService } from './services/cloudflare.service';
import { PoliciesModule } from '../policies/policies.module';

@Module({
  controllers: [TunnelsController],
  providers: [TunnelsService, CloudflareService],
  imports: [PoliciesModule],
})
export class TunnelsModule {}
