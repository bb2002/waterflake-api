import { InternalServerErrorException } from '@nestjs/common';

export default class CloudflareErrorException extends InternalServerErrorException {
  constructor(msg: string) {
    super(`Cloudflare error: ${msg}`);
  }
}
