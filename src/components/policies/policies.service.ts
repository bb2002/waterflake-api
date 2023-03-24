import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import PolicyEntity from './entities/policy.entity';

@Injectable()
export class PoliciesService {
  constructor(private readonly policyRepository: Repository<PolicyEntity>) {}

  async getPolicyById(id: number): Promise<PolicyEntity | null> {
    return this.policyRepository.findOne({
      where: {
        _id: id,
      },
    });
  }

  async getPolicyByKey(key: string): Promise<PolicyEntity | null> {
    return this.policyRepository.findOne({
      where: {
        key,
      },
    });
  }

  async getAllPolicies(): Promise<PolicyEntity[]> {
    return this.policyRepository.find();
  }
}
