import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import PlanEntity from '../../plans/entities/plan.entity';
import SubDomainTooShortException from '../exceptions/SubDomainTooShort.exception';
import { InjectRepository } from '@nestjs/typeorm';
import TunnelEntity from '../entities/tunnel.entity';
import { Repository } from 'typeorm';
import Domain from '../types/Domain';
import DomainAlreadyExistsException from '../exceptions/DomainAlreadyExists.exception';
import { PoliciesService } from '../../policies/policies.service';
import BlockedDomainException from '../exceptions/BlockedDomain.exception';
import UserEntity from '../../users/entities/user.entity';
import TunnelCountExceedException from '../exceptions/TunnelCountExceed.exception';
import CreateTunnelDto from '../dto/CreateTunnel.dto';
import transformAndValidate from '../../../common/utils/TransformAndValidate';
import CreateSRVRecordDto from '../dto/CreateSRVRecord.dto';
import LocalServer from '../../../common/enums/LocalServer';
import LocalServerPolicy from '../types/LocalServerPolicy';
import InvalidInputException from '../../../common/exceptions/InvalidInput.exception';
import { PlansService } from '../../plans/plans.service';
import { RegionsService } from '../../regions/regions.service';
import CloudflareZoneID from '../../../common/enums/CloudflareZoneID';
import CreateTunnelFailureException from '../exceptions/CreateTunnelFailure.exception';
import { Snowflake } from 'nodejs-snowflake';
import { v4 as uuidv4 } from 'uuid';
import RegionEntity from '../../regions/entities/region.entity';
import DeleteSRVRecordDto from '../dto/DeleteSRVRecord.dto';
import DeleteTunnelFailureException from '../exceptions/DeleteTunnelFailure.exception';
import UpdateTunnelDto from '../dto/UpdateTunnel.dto';

@Injectable()
export class TunnelsService {
  constructor(
    private readonly cloudflareService: CloudflareService,
    private readonly policiesService: PoliciesService,
    private readonly plansService: PlansService,
    @Inject(forwardRef(() => RegionsService))
    private readonly regionsService: RegionsService,
    @InjectRepository(TunnelEntity)
    private readonly tunnelRepository: Repository<TunnelEntity>,
  ) {}

  private readonly logger = new Logger(TunnelsService.name);

  async getTunnelsByUser(user: UserEntity) {
    return this.tunnelRepository.find({
      where: {
        owner: {
          _id: user._id,
        },
      },
    });
  }

  async getTunnelByClientId(clientId: string): Promise<TunnelEntity | null> {
    return this.tunnelRepository.findOne({
      where: {
        clientId,
      },
      relations: ['owner', 'plan', 'region'],
    });
  }

  async getTunnelByDomain(domain: Domain) {
    return this.tunnelRepository.findOne({
      where: {
        subDomain: domain.subDomain,
        rootDomain: domain.rootDomain,
      },
    });
  }

  async updateTunnel(tunnel: TunnelEntity, updateTunnelDto: UpdateTunnelDto) {
    const { name } = updateTunnelDto;
    return this.tunnelRepository.update({ name }, tunnel);
  }

  async deleteTunnel(tunnel: TunnelEntity) {
    const { DNSRecordId, rootDomain } = tunnel;

    const deleteSRVRecordDto = await transformAndValidate(DeleteSRVRecordDto, {
      DNSRecordId,
      zoneId: CloudflareZoneID[rootDomain],
    });

    try {
      // 터널을 디비상에서 삭제
      await this.tunnelRepository.delete(tunnel);

      // Cloudflare SRV 레코드 삭제
      await this.cloudflareService.deleteSRVRecord(deleteSRVRecordDto);

      // TODO Waterflake Tunnel API 중지 요청 보내기
      // 해당 터널을 중지 시킴

      // TODO 삭제된 터널에 대한 로그를 남긴다.
    } catch (ex) {
      this.logger.error(ex);
      throw new DeleteTunnelFailureException();
    }
  }

  async createTunnel(owner: UserEntity, createTunnelDto: CreateTunnelDto) {
    const { name, localServer, planId, regionId, rootDomain, subDomain } =
      createTunnelDto;

    const [localServerPolicy, region, plan] = await Promise.all([
      await this.getLocalServerPolicy(localServer),
      await this.regionsService.getRegionById(regionId),
      await this.plansService.getPlanById(planId),
    ]);

    if (!localServerPolicy || !region || !plan) {
      throw new InvalidInputException();
    }

    const [inPort, outPort] = await this.generatePortFromRegion(region);

    const createSRVRecordDto = await transformAndValidate(CreateSRVRecordDto, {
      protocol: localServerPolicy.protocol,
      subDomain: createTunnelDto.subDomain,
      port: outPort,
      target: region.SRVTarget,
      zoneId: CloudflareZoneID[rootDomain],
    });

    try {
      const uid = new Snowflake();
      const clientId = uid.getUniqueID().toString();
      const clientSecret = uuidv4().replace(/-/g, '');

      // Create the SRV record
      const createSRVRecordResult =
        await this.cloudflareService.createSRVRecord(createSRVRecordDto);

      // TODO Waterflake Tunnel API 에 생성 요청 보내기
      // API 요청 주소는 Region 객체에서 읽기
      // axios.post(`${region.apiEndpoint}/server`)

      // Create Tunnel Entity
      return this.tunnelRepository.save({
        name,
        subDomain,
        rootDomain,
        clientId,
        clientSecret,
        inPort,
        outPort,
        DNSRecordId: createSRVRecordResult.result.id,
        owner,
        plan,
        region,
      });
    } catch (ex) {
      this.logger.error(ex);
      throw new CreateTunnelFailureException();
    }
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

  async getLocalServerPolicy(
    localServer: LocalServer,
  ): Promise<LocalServerPolicy | null> {
    const json = JSON.parse(
      (
        await this.policiesService.getPolicyByKey(
          `localServer.policy.${localServer}`,
        )
      )?.value ?? '{}',
    );

    return json ? (json as LocalServerPolicy) : null;
  }

  async generatePortFromRegion(region: RegionEntity): Promise<number[]> {
    const usingPorts = (
      await this.tunnelRepository
        .createQueryBuilder()
        .select(['in_port', 'out_port'])
        .where('region_id = :regionId', { regionId: region._id })
        .getMany()
    )
      .map((entity) => [entity.inPort, entity.outPort])
      .reduce((pv, cv) => [...pv, ...cv], []);

    const ports = Array.from(Array(region.endPortRange + 1).keys())
      .slice(region.startPortRange)
      .filter((x) => !usingPorts.includes(x));

    return [
      ports[Math.floor(Math.random() * ports.length)],
      ports[Math.floor(Math.random() * ports.length)],
    ];
  }
}
