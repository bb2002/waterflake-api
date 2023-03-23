import { Module } from '@nestjs/common';
import { TunnelsController } from './tunnels.controller';
import { TunnelsService } from './services/tunnels.service';
import { CloudflareService } from './services/cloudflare.service';

@Module({
  controllers: [TunnelsController],
  providers: [TunnelsService, CloudflareService],
})
export class TunnelsModule {}
