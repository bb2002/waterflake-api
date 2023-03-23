import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PlanEntity from './entities/plan.entity';

@Module({
  providers: [PlansService],
  imports: [TypeOrmModule.forFeature([PlanEntity])],
})
export class PlansModule {}
