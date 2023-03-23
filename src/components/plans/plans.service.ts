import { Injectable } from '@nestjs/common';
import PlanEntity from './entities/plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import PlanNotFoundException from './exceptions/PlanNotFound.exception';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async getPlanById(id: number): Promise<PlanEntity | null> {
    return this.planRepository.findOne({
      where: {
        _id: id,
      },
    });
  }

  async getOrThrowPlanById(id: number): Promise<PlanEntity> {
    const plan = await this.getPlanById(id);
    if (plan) {
      return plan;
    }

    throw new PlanNotFoundException();
  }

  async getAllPlans(): Promise<PlanEntity[]> {
    return this.planRepository.find();
  }
}
