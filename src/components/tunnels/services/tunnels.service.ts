import { Injectable } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import PlanEntity from '../../plans/entities/plan.entity';

@Injectable()
export class TunnelsService {
  constructor(private readonly cloudflareService: CloudflareService) {}

  async validateSubDomain(subDomain: string, plan: PlanEntity) {
    if (plan.minDomainLength > subDomain.length) {
    }
  }
}
