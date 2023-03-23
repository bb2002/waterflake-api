import { Injectable } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';

@Injectable()
export class TunnelsService {
  constructor(private readonly cloudflareService: CloudflareService) {}
}
