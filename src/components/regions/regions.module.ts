import { forwardRef, Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import RegionEntity from './entities/region.entity';
import { RegionsController } from './regions.controller';
import { TunnelsModule } from '../tunnels/tunnels.module';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
  imports: [
    TypeOrmModule.forFeature([RegionEntity]),
    forwardRef(() => TunnelsModule),
  ],
  exports: [RegionsService],
})
export class RegionsModule {}
