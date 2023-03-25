import { Injectable } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import PlanEntity from '../../plans/entities/plan.entity';
import SubDomainTooShortException from '../exceptions/SubDomainTooShort.exception';
import { InjectRepository } from '@nestjs/typeorm';
import TunnelEntity from '../entities/tunnel.entity';
import { Repository } from 'typeorm';
import RootDomain from '../../../common/enums/RootDomain';
import Domain from '../types/Domain';
import DomainAlreadyExistsException from '../exceptions/DomainAlreadyExists.exception';
import { PoliciesService } from '../../policies/policies.service';
import BlockedDomainException from '../exceptions/BlockedDomain.exception';
import UserEntity from '../../users/entities/user.entity';
import TunnelCountExceedException from '../exceptions/TunnelCountExceed.exception';
import CreateTunnelDto from "../dto/CreateTunnel.dto";

@Injectable()
export class TunnelsService {
  constructor(
    private readonly cloudflareService: CloudflareService,
    private readonly policiesService: PoliciesService,
    @InjectRepository(TunnelEntity)
    private readonly tunnelRepository: Repository<TunnelEntity>,
  ) {}

  async createTunnel(owner: UserEntity, createTunnelDto: CreateTunnelDto) {

  }

  async validateCanUserCreateTunnel(user: UserEntity) {
    if (await this.isUserTunnelCountExceed(user)) {
      throw new TunnelCountExceedException();
    }
  }

  async validateDomain(domain: Domain, plan: PlanEntity) {
    if (plan.minDomainLength > domain.subDomain.length) {
      throw new SubDomainTooShortException();
    }

    if (await this.getTunnelByDomain(domain)) {
      throw new DomainAlreadyExistsException();
    }

    if (await this.isBlockedSubDomain(domain.subDomain)) {
      throw new BlockedDomainException();
    }
  }

  async isBlockedSubDomain(subDomain: string): Promise<boolean> {
    return (await this.getBlockedSubDomains()).indexOf(subDomain) !== -1;
  }

  async isUserTunnelCountExceed(user: UserEntity): Promise<boolean> {
    const myTunnelCount = await this.tunnelRepository.count({
      where: {
        owner: {
          _id: user._id,
        },
      },
    });

    return myTunnelCount >= (await this.getMaxTunnelCount());
  }

  async getBlockedSubDomains(): Promise<string[]> {
    const json = JSON.parse(
      (
        await this.policiesService.getPolicyByKey(
          'tunnel.domain.blockedSubDomains',
        )
      )?.value ?? '[]',
    );
    return json ? (json as string[]) : [];
  }

  async getMaxTunnelCount() {
    const value = await this.policiesService.getPolicyByKey(
      'tunnel.rules.maxTunnelCount',
    );
    if (value) {
      return Number(value.value);
    }

    return Infinity;
  }

  async getTunnelByDomain(domain: Domain) {
    return this.tunnelRepository.findOne({
      where: {
        subDomain: domain.subDomain,
        rootDomain: domain.rootDomain,
      },
    });
  }
}
