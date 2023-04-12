import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import RegionEntity from '../../regions/entities/region.entity';
import TunnelServerException from '../exceptions/TunnelServer.exception';

interface StartUpTunnelParams {
  region: RegionEntity;
  clientId: string;
}

interface ShutdownTunnelParams {
  region: RegionEntity;
  clientId: string;
}

@Injectable()
export class TunnelServerService {
  async startUpTunnel({
    region,
    clientId,
  }: StartUpTunnelParams): Promise<number> {
    const response = await this.createTunnelServerAxios(
      region.accessToken,
    ).post('/server/load', {
      clientId,
    });

    if (response.status === HttpStatus.CREATED) {
      return response.data._id as number;
    }

    throw new TunnelServerException('StartUp failure');
  }

  async shutdownTunnel({ region, clientId }: ShutdownTunnelParams) {
    const response = await this.createTunnelServerAxios(
      region.accessToken,
    ).delete(`/server/shutdown/${clientId}`);

    if (response.status === HttpStatus.OK) {
      return;
    }

    throw new TunnelServerException('Shutdown failure');
  }

  private createTunnelServerAxios(token: string) {
    return axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
