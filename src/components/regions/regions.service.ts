import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import RegionEntity from './entities/region.entity';
import { InjectRepository } from '@nestjs/typeorm';
import RegionNotFoundException from './exceptions/RegionNotFound.exception';
import { TunnelsService } from '../tunnels/services/tunnels.service';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}

  async getRegionById(id: number): Promise<RegionEntity | null> {
    return this.regionRepository.findOne({
      where: {
        _id: id,
      },
    });
  }

  async getRegionByToken(token: string): Promise<RegionEntity | null> {
    return this.regionRepository.findOne({
      where: {
        accessToken: token,
      },
    });
  }

  async getOrThrowRegionById(id: number): Promise<RegionEntity> {
    const region = await this.getRegionById(id);
    if (region) {
      return region;
    }

    throw new RegionNotFoundException();
  }

  async getAllRegions(): Promise<RegionEntity[]> {
    return this.regionRepository.find();
  }
}
