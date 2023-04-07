import { HttpStatus, Injectable } from '@nestjs/common';
import CreateSRVRecordDto from '../dto/CreateSRVRecord.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import CloudflareSRVRecordResult from '../types/CloudflareSRVRecordResult';
import DeleteSRVRecordDto from '../dto/DeleteSRVRecord.dto';
import CloudflareErrorException from '../exceptions/CloudflareError.exception';

@Injectable()
export class CloudflareService {
  constructor(private readonly configService: ConfigService) {}

  async createSRVRecord(
    createSRVRecordDto: CreateSRVRecordDto,
  ): Promise<CloudflareSRVRecordResult> {
    const { target, protocol, subDomain, zoneId, port } = createSRVRecordDto;
    const cloudflareToken = this.configService.get<string>('CLOUDFLARE_TOKEN');

    const response = await this.createCloudflareAxios(cloudflareToken).post(
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
    );

    if (
      response.status === HttpStatus.CREATED ||
      response.status === HttpStatus.OK
    ) {
      return response.data as CloudflareSRVRecordResult;
    }

    throw new CloudflareErrorException(response.statusText);
  }

  async deleteSRVRecord(
    deleteSRVRecordDto: DeleteSRVRecordDto,
  ): Promise<string> {
    const { DNSRecordId, zoneId } = deleteSRVRecordDto;
    const cloudflareToken = this.configService.get<string>('CLOUDFLARE_TOKEN');

    const response = await this.createCloudflareAxios(cloudflareToken).delete(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${DNSRecordId}`,
    );

    if (response.status === HttpStatus.OK) {
      return zoneId;
    }

    throw new CloudflareErrorException(response.statusText);
  }

  private createCloudflareAxios(cloudflareToken: string) {
    return axios.create({
      headers: {
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
