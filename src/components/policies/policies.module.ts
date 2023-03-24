import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PolicyEntity from './entities/policy.entity';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService],
  imports: [TypeOrmModule.forFeature([PolicyEntity])],
  exports: [PoliciesService],
})
export class PoliciesModule {}
