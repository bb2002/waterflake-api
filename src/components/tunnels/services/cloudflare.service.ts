import { Injectable } from '@nestjs/common';
import CreateSRVRecordDto from '../dto/CreateSRVRecord.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import CloudflareSRVRecordResult from '../types/CloudflareSRVRecordResult';

@Injectable()
export class CloudflareService {
  constructor(private readonly configService: ConfigService) {}

  async createSRVRecord(
    createSRVRecordDto: CreateSRVRecordDto,
  ): Promise<CloudflareSRVRecordResult> {
    const { target, protocol, subDomain, zoneId, port } = createSRVRecordDto;
    const cloudflareToken = this.configService.get<string>('CLOUDFLARE_TOKEN');

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        type: 'SRV',
        data: {
          service: '_minecraft',
          proto: protocol,
          name: subDomain,
          priority: 1,
          weight: 1,
          port: port,
          target: target,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data as CloudflareSRVRecordResult;
  }
}
