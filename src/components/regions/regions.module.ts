import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import RegionEntity from './entities/region.entity';
import { RegionsController } from './regions.controller';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  exports: [RegionsService],
})
export class RegionsModule {}
